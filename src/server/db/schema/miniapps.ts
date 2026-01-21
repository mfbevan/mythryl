import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import type {
  FarcasterAccountAssociation,
  FarcasterAppConfig,
  FarcasterBaseBuilder,
} from "~/server/api/schema/farcaster-manifest.validator";

import { users } from "./users";

// Zod enum for DB status (only verified apps are stored)
export const miniappStatusSchema = z.enum(["verified", "suspicious"]);
export type MiniappStatus = z.infer<typeof miniappStatusSchema>;

// Zod enum for API response status (includes unverified for non-stored apps)
export const miniappResponseStatusSchema = z.enum([
  "verified",
  "suspicious",
  "unverified",
]);
export type MiniappResponseStatus = z.infer<typeof miniappResponseStatusSchema>;

export type MiniappManifest = {
  config: FarcasterAppConfig;
  accountAssociation: FarcasterAccountAssociation;
  baseBuilder?: FarcasterBaseBuilder;
};

export const miniapps = pgTable("miniapps", {
  // URL as primary key (normalized: no protocol, no www, no trailing slash)
  url: text("url").primaryKey(),

  // Owner FID extracted from account association
  ownerFid: integer("owner_fid").notNull(),

  // Status: "verified" or "suspicious" (only these are stored in DB)
  status: text("status").notNull().default("verified").$type<MiniappStatus>(),

  // Full manifest as JSONB (single source of truth)
  manifest: jsonb("manifest").notNull().$type<MiniappManifest>(),

  // Denormalized for search (combines name, subtitle, description, tags)
  searchText: text("search_text").notNull(),

  // Denormalized for filtering
  category: text("category"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  lastFetchedAt: timestamp("last_fetched_at").defaultNow().notNull(),
});
export type Miniapp = typeof miniapps.$inferSelect;
export type NewMiniapp = typeof miniapps.$inferInsert;

export const userMiniapps = pgTable(
  "user_miniapps",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    miniappUrl: text("miniapp_url")
      .notNull()
      .references(() => miniapps.url, { onDelete: "cascade" }),

    // Notification settings
    notificationsEnabled: boolean("notifications_enabled")
      .default(false)
      .notNull(),

    // Timestamps
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint: user can only add an app once
    userMiniappUnique: unique().on(table.userId, table.miniappUrl),
  }),
);
export type UserMiniapp = typeof userMiniapps.$inferSelect;
export type NewUserMiniapp = typeof userMiniapps.$inferInsert;

// Relations
export const miniappsRelations = relations(miniapps, ({ many }) => ({
  userMiniapps: many(userMiniapps),
}));

export const userMiniappsRelations = relations(userMiniapps, ({ one }) => ({
  user: one(users, {
    fields: [userMiniapps.userId],
    references: [users.id],
  }),
  miniapp: one(miniapps, {
    fields: [userMiniapps.miniappUrl],
    references: [miniapps.url],
  }),
}));
