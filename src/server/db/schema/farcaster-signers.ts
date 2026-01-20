import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export type SignerStatus =
  | "generated"
  | "pending_approval"
  | "approved"
  | "revoked";

export const farcasterSigners = pgTable("farcaster_signers", {
  id: uuid("uuid").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fid: integer("fid").notNull(),
  signerUuid: text("signer_uuid").notNull(),
  publicKey: text("public_key"),
  status: text("status").default("generated").$type<SignerStatus>(),
  approvalUrl: text("approval_url"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});
export type FarcasterSigner = typeof farcasterSigners.$inferSelect;
export type NewFarcasterSigner = typeof farcasterSigners.$inferInsert;
