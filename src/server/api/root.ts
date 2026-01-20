import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users/users.router";
import { filesRouter } from "./routers/files/_file.router";
import { appsRouter } from "./routers/apps/_apps.router";
import { tokensRouter } from "./routers/tokens/_tokens.router";
import { signersRouter } from "./routers/signers/signers.router";
import { onboardingRouter } from "./routers/onboarding/onboarding.router";
import { feedRouter } from "./routers/feed/feed.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  files: filesRouter,
  apps: appsRouter,
  tokens: tokensRouter,
  signers: signersRouter,
  onboarding: onboardingRouter,
  feed: feedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
