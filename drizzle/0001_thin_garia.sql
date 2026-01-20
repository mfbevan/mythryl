CREATE TYPE "public"."account_type" AS ENUM('farcaster', 'base');--> statement-breakpoint
CREATE TYPE "public"."auth_address_status" AS ENUM('pending', 'approved');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('pending', 'wallet_created', 'signer_pending', 'signer_approved', 'auth_address_pending', 'complete');--> statement-breakpoint
CREATE TYPE "public"."signer_status" AS ENUM('pending_approval', 'approved', 'revoked');--> statement-breakpoint
CREATE TABLE "user_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_type" "account_type" NOT NULL,
	"account_id" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farcaster_signers" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"fid" integer NOT NULL,
	"signer_uuid" text NOT NULL,
	"public_key" text,
	"status" "signer_status" DEFAULT 'pending_approval',
	"approval_url" text,
	"created_at" timestamp DEFAULT now(),
	"approved_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "flags" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_status" "onboarding_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "auth_address_status" "auth_address_status";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "auth_address_approval_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "neynar" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_synced_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farcaster_signers" ADD CONSTRAINT "farcaster_signers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;