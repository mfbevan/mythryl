CREATE TYPE "public"."user_status" AS ENUM('active', 'nerfed', 'banned');--> statement-breakpoint
CREATE TABLE "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fid" integer,
	"address" text,
	"status" "user_status" DEFAULT 'active'
);
