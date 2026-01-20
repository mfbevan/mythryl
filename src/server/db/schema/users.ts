import { relations } from "drizzle-orm";
import {
  pgTable,
  jsonb,
  text,
  uuid,
  pgEnum,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import type { Address } from "thirdweb";

import type { LiteFarcasterUser } from "~/services/neynar.service";

export const userStatus = pgEnum("user_status", ["active", "nerfed", "banned"]);
export type UserStatus = (typeof userStatus.enumValues)[number];

export const onboardingStatus = pgEnum("onboarding_status", [
  "pending",
  "wallet_created",
  "signer_pending",
  "signer_approved",
  "auth_address_pending",
  "complete",
]);
export type OnboardingStatus = (typeof onboardingStatus.enumValues)[number];

export const authAddressStatus = pgEnum("auth_address_status", [
  "pending",
  "approved",
]);
export type AuthAddressStatus = (typeof authAddressStatus.enumValues)[number];

export type UserFlags = "termsAccepted";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fid: integer("fid"),
  address: text("address").$type<Address>(),
  flags: jsonb("flags")
    .default({})
    .$type<Partial<Record<UserFlags, boolean>>>(),
  status: userStatus("status").default("active").$type<UserStatus>(),
  onboardingStatus: onboardingStatus("onboarding_status").default("pending"),
  authAddressStatus: authAddressStatus("auth_address_status"),
  authAddressApprovalUrl: text("auth_address_approval_url"),
  neynar: jsonb("neynar").default({}).$type<LiteFarcasterUser>(),
  lastSyncedAt: timestamp("last_synced_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const accountType = pgEnum("account_type", ["farcaster", "base"]);
export type AccountType = (typeof accountType.enumValues)[number];

export const userAccounts = pgTable("user_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  accountType: accountType("account_type").notNull(),
  accountId: text("account_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar").notNull(),
});
export type PlayerAccount = typeof userAccounts.$inferInsert;
export type NewPlayerAccount = typeof userAccounts.$inferInsert;

export const userRelations = relations(users, ({ one, many }) => ({
  userAccounts: many(userAccounts),
}));

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(users, {
    fields: [userAccounts.playerId],
    references: [users.id],
  }),
}));
