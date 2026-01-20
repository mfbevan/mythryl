ALTER TABLE "farcaster_signers" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "farcaster_signers" ALTER COLUMN "status" SET DEFAULT 'generated';--> statement-breakpoint
DROP TYPE "public"."signer_status";