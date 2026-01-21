import z from "zod";

import { protectedProcedure } from "../../trpc";
import { normalizeUrl, removeMiniappForUser } from "./apps.service";

export const removeApp = protectedProcedure
  .input(
    z.object({
      url: z.string().min(1),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const normalizedUrl = normalizeUrl(input.url);

    await removeMiniappForUser(ctx.db)(ctx.user.id, normalizedUrl);

    return { success: true };
  });
