CREATE TABLE "farcaster_profiles" (
	"fid" integer PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"pfp_url" text,
	"profile" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"last_fetched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "farcaster_profiles_username_idx" ON "farcaster_profiles" USING btree ("username");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "neynar";