import {
  pgTable,
  jsonb,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

import type { CachedFarcasterProfile } from "~/services/neynar.service";

export const farcasterProfiles = pgTable(
  "farcaster_profiles",
  {
    fid: integer("fid").primaryKey(),
    username: text("username").notNull(),
    displayName: text("display_name"),
    pfpUrl: text("pfp_url"),
    profile: jsonb("profile").notNull().$type<CachedFarcasterProfile>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    lastFetchedAt: timestamp("last_fetched_at").defaultNow().notNull(),
  },
  (table) => [index("farcaster_profiles_username_idx").on(table.username)],
);

export type FarcasterProfile = typeof farcasterProfiles.$inferSelect;
export type NewFarcasterProfile = typeof farcasterProfiles.$inferInsert;
