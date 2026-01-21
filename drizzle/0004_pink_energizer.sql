CREATE TABLE "miniapps" (
	"url" text PRIMARY KEY NOT NULL,
	"owner_fid" integer NOT NULL,
	"status" text DEFAULT 'verified' NOT NULL,
	"manifest" jsonb NOT NULL,
	"search_text" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"last_fetched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_miniapps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"miniapp_url" text NOT NULL,
	"notifications_enabled" boolean DEFAULT false NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_miniapps_user_id_miniapp_url_unique" UNIQUE("user_id","miniapp_url")
);
--> statement-breakpoint
ALTER TABLE "user_miniapps" ADD CONSTRAINT "user_miniapps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_miniapps" ADD CONSTRAINT "user_miniapps_miniapp_url_miniapps_url_fk" FOREIGN KEY ("miniapp_url") REFERENCES "public"."miniapps"("url") ON DELETE cascade ON UPDATE no action;