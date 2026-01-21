import z from "zod";

import { publicProcedure } from "../../trpc";
import { getOrFetchMiniapp } from "./apps.service";

export const getApp = publicProcedure
  .input(
    z.object({
      url: z.string().min(1),
      forceRefresh: z.boolean().optional().default(false),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    return getOrFetchMiniapp(ctx.db)(input.url, userId, input.forceRefresh);
  });
