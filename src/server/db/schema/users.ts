import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { LiteFarcasterUser } from "~/services/neynar.service";

export const userStatus = pgEnum("user_status", ["active", "nerfed", "banned"]);
export type UserStatus = (typeof userStatus.enumValues)[number];

export const userRole = pgEnum("user_role", ["user", "admin", "creator"]);
export type UserRole = (typeof userRole.enumValues)[number];

export type UserFlags = "termsAccepted" | "appShared";

export const users = pgTable("users", {
  id: uuid("uuid").notNull().primaryKey().defaultRandom(),
  fid: integer("fid"),
  flags: jsonb("flags")
    .default({})
    .$type<Partial<Record<UserFlags, boolean>>>(),
  lastSyncedAt: timestamp("last_synced_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  status: userStatus("status").default("active").$type<UserStatus>(),
  neynar: jsonb("neynar").default({}).$type<LiteFarcasterUser>(),
  role: userRole("role").default("user").notNull().$type<UserRole>(),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const accountType = pgEnum("account_type", [
  "farcaster",
  "google",
  "github",
  "wallet",
  "discord",
  "twitter",
]);
export type AccountType = (typeof accountType.enumValues)[number];

export const userAccounts = pgTable("user_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  accountType: accountType("account_type").notNull(),
  accountId: text("account_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar").notNull(),
});
export type UserAccount = typeof userAccounts.$inferSelect;
export type NewUserAccount = typeof userAccounts.$inferInsert;

export const formatCreatorAccount = (creator: UserAccount) => {
  return {
    id: creator.userId,
    fid: creator.accountType === "farcaster" ? creator.accountId : null,
    username: creator.username,
    displayName: creator.displayName,
    avatar: creator.avatar,
  };
};
export type CreatorAccount = ReturnType<typeof formatCreatorAccount>;
