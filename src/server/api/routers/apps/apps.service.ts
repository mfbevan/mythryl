import { TRPCError } from "@trpc/server";
import { and, eq, desc, sql } from "drizzle-orm";

import type { DB } from "~/server/db";
import {
  miniapps,
  userMiniapps,
  type MiniappManifest,
  type MiniappStatus,
  type MiniappResponseStatus,
  type NewMiniapp,
} from "~/server/db/schema";
import {
  farcasterManifestSchema,
  type FarcasterAccountAssociation,
  type FarcasterAppConfig,
  type FarcasterBaseBuilder,
} from "~/server/api/schema/farcaster-manifest.validator";

/**
 * Normalize URL for consistent storage and lookup.
 * Strips protocol, www, and trailing slash; lowercases the result.
 */
export const normalizeUrl = (url: string): string => {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
    .toLowerCase();
};

/**
 * Extract owner FID from account association by decoding the base64 header.
 */
export const extractOwnerFid = (
  accountAssociation: FarcasterAccountAssociation,
): number | null => {
  try {
    const decoded = Buffer.from(accountAssociation.header, "base64").toString(
      "utf-8",
    );
    const parsed = JSON.parse(decoded) as { fid?: number };
    return parsed.fid ?? null;
  } catch {
    return null;
  }
};

/**
 * Build search text from manifest config for full-text search.
 */
export const buildSearchText = (manifest: MiniappManifest): string => {
  const { config } = manifest;
  return [config.name, config.subtitle, config.description, ...(config.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

/**
 * Get a miniapp by URL with user relationship via join.
 */
export const getMiniappByUrl = (db: DB) => async (url: string, userId?: string) => {
  const normalizedUrl = normalizeUrl(url);

  const [result] = await db
    .select({
      miniapp: miniapps,
      userMiniapp: userMiniapps,
    })
    .from(miniapps)
    .where(eq(miniapps.url, normalizedUrl))
    .leftJoin(
      userMiniapps,
      and(
        eq(userMiniapps.miniappUrl, miniapps.url),
        userId ? eq(userMiniapps.userId, userId) : sql`false`,
      ),
    )
    .limit(1);

  return result ?? null;
};

/**
 * Upsert a miniapp into the database.
 */
export const upsertMiniapp = (db: DB) => async (data: {
  url: string;
  ownerFid: number;
  manifest: MiniappManifest;
  status?: MiniappStatus;
}) => {
  const normalizedUrl = normalizeUrl(data.url);
  const searchText = buildSearchText(data.manifest);
  const category = data.manifest.config.primaryCategory ?? null;

  const values: NewMiniapp = {
    url: normalizedUrl,
    ownerFid: data.ownerFid,
    status: data.status ?? "verified",
    manifest: data.manifest,
    searchText,
    category,
    lastFetchedAt: new Date(),
  };

  const [result] = await db
    .insert(miniapps)
    .values(values)
    .onConflictDoUpdate({
      target: miniapps.url,
      set: {
        ownerFid: values.ownerFid,
        status: values.status,
        manifest: values.manifest,
        searchText: values.searchText,
        category: values.category,
        lastFetchedAt: values.lastFetchedAt,
      },
    })
    .returning();

  return result;
};

/**
 * Add a miniapp to the user's collection.
 */
export const addMiniappForUser = (db: DB) => async (
  userId: string,
  miniappUrl: string,
  notificationsEnabled = false,
) => {
  const [result] = await db
    .insert(userMiniapps)
    .values({
      userId,
      miniappUrl: normalizeUrl(miniappUrl),
      notificationsEnabled,
    })
    .onConflictDoUpdate({
      target: [userMiniapps.userId, userMiniapps.miniappUrl],
      set: { notificationsEnabled },
    })
    .returning();

  return result;
};

/**
 * Remove a miniapp from the user's collection.
 */
export const removeMiniappForUser = (db: DB) => async (userId: string, miniappUrl: string) => {
  await db
    .delete(userMiniapps)
    .where(
      and(
        eq(userMiniapps.userId, userId),
        eq(userMiniapps.miniappUrl, normalizeUrl(miniappUrl)),
      ),
    );
};

/**
 * Update notification settings for a user's added miniapp.
 */
export const updateMiniappNotifications = (db: DB) => async (
  userId: string,
  miniappUrl: string,
  enabled: boolean,
) => {
  const [result] = await db
    .update(userMiniapps)
    .set({ notificationsEnabled: enabled })
    .where(
      and(
        eq(userMiniapps.userId, userId),
        eq(userMiniapps.miniappUrl, normalizeUrl(miniappUrl)),
      ),
    )
    .returning();

  return result;
};

/**
 * Get all miniapps the user has added.
 */
export const getUserMiniapps = (db: DB) => async (userId: string) => {
  return db
    .select({
      miniapp: miniapps,
      userMiniapp: userMiniapps,
    })
    .from(userMiniapps)
    .where(eq(userMiniapps.userId, userId))
    .innerJoin(miniapps, eq(miniapps.url, userMiniapps.miniappUrl))
    .orderBy(desc(userMiniapps.addedAt));
};

/**
 * Get all unique categories from indexed miniapps.
 */
export const getMiniappCategories = (db: DB) => async () => {
  const result = await db
    .selectDistinct({ category: miniapps.category })
    .from(miniapps)
    .where(sql`${miniapps.category} IS NOT NULL`);

  return result
    .map((r) => r.category)
    .filter((c): c is string => c !== null)
    .sort();
};

/**
 * Manifest type for resolved apps (allows undefined accountAssociation for unverified apps).
 */
export type ResolvedManifest = {
  config: FarcasterAppConfig;
  accountAssociation?: FarcasterAccountAssociation;
  baseBuilder?: FarcasterBaseBuilder;
};

/**
 * Resolved miniapp type with config always defined.
 */
export type ResolvedMiniapp = {
  url: string;
  domain: string;
  status: MiniappResponseStatus;
  config: FarcasterAppConfig;
  manifest: ResolvedManifest;
  ownerFid: number | null;
  userMiniapp: typeof userMiniapps.$inferSelect | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  lastFetchedAt?: Date;
  searchText?: string;
  category?: string | null;
};

/**
 * Fetch manifest from URL and validate it.
 * Supports both `miniApp` and `frame` fields, with `miniApp` taking priority.
 */
const fetchManifest = async (normalizedUrl: string) => {
  const domain = normalizedUrl.split("/")[0]!;
  const manifestUrl = `https://${domain}/.well-known/farcaster.json`;

  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Failed to fetch manifest from ${manifestUrl}`,
    });
  }

  const json = await response.json();
  const manifest = farcasterManifestSchema.parse(json);

  // Support both miniApp and frame fields, with miniApp taking priority
  const config = manifest.miniApp ?? manifest.frame;
  if (!config) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Manifest does not contain a miniApp or frame configuration",
    });
  }

  return { config, accountAssociation: manifest.accountAssociation, baseBuilder: manifest.baseBuilder };
};

/**
 * Get or fetch a miniapp, checking cache first.
 * Returns a consistent shape with config always defined.
 */
export const getOrFetchMiniapp = (db: DB) => async (
  url: string,
  userId?: string,
  forceRefresh = false,
): Promise<ResolvedMiniapp> => {
  const normalizedUrl = normalizeUrl(url);

  // Check DB cache first (unless forceRefresh)
  if (!forceRefresh) {
    const cached = await getMiniappByUrl(db)(normalizedUrl, userId);
    if (cached) {
      return {
        url: cached.miniapp.url,
        domain: cached.miniapp.url,
        status: cached.miniapp.status,
        config: cached.miniapp.manifest.config,
        manifest: cached.miniapp.manifest,
        ownerFid: cached.miniapp.ownerFid,
        userMiniapp: cached.userMiniapp,
        createdAt: cached.miniapp.createdAt,
        updatedAt: cached.miniapp.updatedAt,
        lastFetchedAt: cached.miniapp.lastFetchedAt,
        searchText: cached.miniapp.searchText,
        category: cached.miniapp.category,
      };
    }
  }

  // Fetch manifest from URL
  const { config, accountAssociation, baseBuilder } = await fetchManifest(normalizedUrl);

  // No account association - return as unverified (don't save to DB)
  if (!accountAssociation) {
    return {
      url: normalizedUrl,
      domain: normalizedUrl,
      status: "unverified",
      config,
      manifest: { config, accountAssociation: undefined, baseBuilder },
      ownerFid: null,
      userMiniapp: null,
    };
  }

  // Extract owner FID from association
  const ownerFid = extractOwnerFid(accountAssociation);
  if (!ownerFid) {
    // Invalid association payload - return as unverified
    return {
      url: normalizedUrl,
      domain: normalizedUrl,
      status: "unverified",
      config,
      manifest: { config, accountAssociation, baseBuilder },
      ownerFid: null,
      userMiniapp: null,
    };
  }

  // Valid association - save to DB as verified
  const manifestData: MiniappManifest = {
    config,
    accountAssociation,
    baseBuilder,
  };

  const miniapp = await upsertMiniapp(db)({
    url: normalizedUrl,
    ownerFid,
    manifest: manifestData,
    status: "verified",
  });

  // Get user relationship if authenticated
  const result = await getMiniappByUrl(db)(normalizedUrl, userId);

  return {
    url: miniapp!.url,
    domain: miniapp!.url,
    status: miniapp!.status,
    config: miniapp!.manifest.config,
    manifest: miniapp!.manifest,
    ownerFid: miniapp!.ownerFid,
    userMiniapp: result?.userMiniapp ?? null,
    createdAt: miniapp!.createdAt,
    updatedAt: miniapp!.updatedAt,
    lastFetchedAt: miniapp!.lastFetchedAt,
    searchText: miniapp!.searchText,
    category: miniapp!.category,
  };
};
