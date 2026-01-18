import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../../trpc";
import {
  getLoginPayload,
  login,
  isLoggedIn,
  logout,
} from "~/server/auth/thirdweb.service";

export const thirdwebRouter = createTRPCRouter({
  getLoginPayload: publicProcedure
    .input(
      z.object({
        address: z.string(),
        chainId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return getLoginPayload(input);
    }),

  login: publicProcedure
    .input(
      z.object({
        payload: z.object({
          domain: z.string(),
          address: z.string(),
          statement: z.string(),
          uri: z.string().optional(),
          version: z.string(),
          chain_id: z.string().optional(),
          nonce: z.string(),
          issued_at: z.string(),
          expiration_time: z.string(),
          invalid_before: z.string().optional(),
          resources: z.array(z.string()).optional(),
        }),
        signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return login(input as Parameters<typeof login>[0]);
    }),

  isLoggedIn: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      return isLoggedIn(input.address);
    }),

  logout: publicProcedure.mutation(async () => {
    return logout();
  }),
});
