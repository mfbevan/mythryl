import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure } from "../../trpc";
import { normalizeUrl, updateMiniappNotifications } from "./apps.service";

export const updateNotifications = protectedProcedure
  .input(
    z.object({
      url: z.string().min(1),
      enabled: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const normalizedUrl = normalizeUrl(input.url);

    const result = await updateMiniappNotifications(ctx.db)(
      ctx.user.id,
      normalizedUrl,
      input.enabled,
    );

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "App not found in your collection",
      });
    }

    return result;
  });
