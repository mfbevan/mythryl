import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const wEnv = createEnv({
  extends: [vercel()],
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Database
    DATABASE_URL: z.string().url(),
    // Farcaster
    NEYNAR_API_KEY: z.string(),
    // Thirdweb
    THIRDWEB_SECRET_KEY: z.string(),
    // QSTASH
    QSTASH_URL: z.string().url(),
    QSTASH_TOKEN: z.string(),
    QSTASH_CURRENT_SIGNING_KEY: z.string(),
    QSTASH_NEXT_SIGNING_KEY: z.string(),
    // Other
    CRON_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Thirdweb
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    // Farcaster
    NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
    // Thirdweb
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    THIRDWEB_WEBHOOK_PAYMENTS: process.env.THIRDWEB_WEBHOOK_PAYMENTS,
    // QSTASH
    QSTASH_URL: process.env.QSTASH_URL,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    // Google
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GOOGLE_VERTEX_PROJECT: process.env.GOOGLE_VERTEX_PROJECT,
    GOOGLE_VERTEX_LOCATION: process.env.GOOGLE_VERTEX_LOCATION,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    // Hugging Face
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    // Other
    CRON_SECRET: process.env.CRON_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   * Skip validation when not in worker mode to avoid checking worker-specific env vars during app builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  // || process.env.WORKER_MODE !== "true",
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: false,
});
