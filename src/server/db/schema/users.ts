import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import type { Address } from "thirdweb";

export const userStatus = pgEnum("user_status", ["active", "nerfed", "banned"]);
export type UserStatus = (typeof userStatus.enumValues)[number];

export const users = pgTable("users", {
  id: uuid("uuid").notNull().primaryKey().defaultRandom(),
  fid: integer("fid"),
  address: text("address").$type<Address>(),
  status: userStatus("status").default("active").$type<UserStatus>(),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
