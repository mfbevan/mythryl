import { eq, inArray } from "drizzle-orm";

import type { DB } from "~/server/db";
import { farcasterProfiles } from "~/server/db/schema";
import {
  type CachedFarcasterProfile,
  fetchFarcasterProfileByFid,
  fetchFarcasterProfileByUsername,
  fetchFarcasterProfilesByFids,
} from "~/services/neynar.service";

// Cache TTL configuration
const CACHE_TTL = {
  FRESH_MS: 60 * 60 * 1000, // 1 hour
  STALE_MS: 24 * 60 * 60 * 1000, // 24 hours
};

type CacheState = "fresh" | "stale" | "expired";

const getCacheState = (lastFetchedAt: Date): CacheState => {
  const age = Date.now() - lastFetchedAt.getTime();
  if (age < CACHE_TTL.FRESH_MS) return "fresh";
  if (age < CACHE_TTL.STALE_MS) return "stale";
  return "expired";
};

// Upsert a profile into the cache
export const upsertProfile =
  (db: DB) =>
  async (profile: CachedFarcasterProfile): Promise<void> => {
    await db
      .insert(farcasterProfiles)
      .values({
        fid: profile.fid,
        username: profile.username,
        displayName: profile.display_name ?? null,
        pfpUrl: profile.pfp_url ?? null,
        profile,
        lastFetchedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: farcasterProfiles.fid,
        set: {
          username: profile.username,
          displayName: profile.display_name ?? null,
          pfpUrl: profile.pfp_url ?? null,
          profile,
          lastFetchedAt: new Date(),
        },
      });
  };

// Get profile by FID with SWR caching
export const getProfileByFid =
  (db: DB) =>
  async (fid: number): Promise<CachedFarcasterProfile | null> => {
    // Check cache
    const cached = await db.query.farcasterProfiles.findFirst({
      where: eq(farcasterProfiles.fid, fid),
    });

    if (cached) {
      const state = getCacheState(cached.lastFetchedAt);

      if (state === "fresh") {
        return cached.profile;
      }

      if (state === "stale") {
        // Background refresh - fire and forget
        void refreshProfile(db)(fid);
        return cached.profile;
      }
    }

    // Expired or missing - fetch fresh
    const profile = await fetchFarcasterProfileByFid(fid);
    if (profile) {
      await upsertProfile(db)(profile);
    }
    return profile;
  };

// Get profile by username with SWR caching
export const getProfileByUsername =
  (db: DB) =>
  async (username: string): Promise<CachedFarcasterProfile | null> => {
    // Check cache by username first
    const cached = await db.query.farcasterProfiles.findFirst({
      where: eq(farcasterProfiles.username, username.toLowerCase()),
    });

    if (cached) {
      const state = getCacheState(cached.lastFetchedAt);

      if (state === "fresh") {
        return cached.profile;
      }

      if (state === "stale") {
        // Background refresh - fire and forget
        void refreshProfile(db)(cached.fid);
        return cached.profile;
      }
    }

    // Expired or missing - fetch fresh via Neynar search
    const profile = await fetchFarcasterProfileByUsername(username);
    if (profile) {
      await upsertProfile(db)(profile);
    }
    return profile;
  };

// Get profiles by FIDs (batch) with SWR caching
export const getProfilesByFids =
  (db: DB) =>
  async (fids: number[]): Promise<CachedFarcasterProfile[]> => {
    if (fids.length === 0) return [];

    // Check cache for all FIDs
    const cached = await db.query.farcasterProfiles.findMany({
      where: inArray(farcasterProfiles.fid, fids),
    });

    const cachedByFid = new Map(cached.map((c) => [c.fid, c]));
    const results: CachedFarcasterProfile[] = [];
    const toFetch: number[] = [];
    const toRefresh: number[] = [];

    for (const fid of fids) {
      const entry = cachedByFid.get(fid);
      if (entry) {
        const state = getCacheState(entry.lastFetchedAt);
        results.push(entry.profile);
        if (state === "stale") {
          toRefresh.push(fid);
        } else if (state === "expired") {
          toFetch.push(fid);
        }
      } else {
        toFetch.push(fid);
      }
    }

    // Background refresh stale entries
    if (toRefresh.length > 0) {
      void refreshProfiles(db)(toRefresh);
    }

    // Fetch missing/expired entries
    if (toFetch.length > 0) {
      const fetched = await fetchFarcasterProfilesByFids(toFetch);
      for (const profile of fetched) {
        await upsertProfile(db)(profile);
        results.push(profile);
      }
    }

    // Return in same order as input fids
    const resultMap = new Map(results.map((r) => [r.fid, r]));
    return fids.map((fid) => resultMap.get(fid)).filter(Boolean) as CachedFarcasterProfile[];
  };

// Refresh a single profile in background
const refreshProfile = (db: DB) => async (fid: number): Promise<void> => {
  console.log(`[Profiles] Background refreshing profile for FID ${fid}`);
  const profile = await fetchFarcasterProfileByFid(fid);
  if (profile) {
    await upsertProfile(db)(profile);
  }
};

// Refresh multiple profiles in background
const refreshProfiles = (db: DB) => async (fids: number[]): Promise<void> => {
  console.log(`[Profiles] Background refreshing ${fids.length} profiles`);
  const profiles = await fetchFarcasterProfilesByFids(fids);
  for (const profile of profiles) {
    await upsertProfile(db)(profile);
  }
};
