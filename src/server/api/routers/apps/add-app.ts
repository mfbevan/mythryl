import { TRPCError } from "@trpc/server";
import z from "zod";

import { protectedProcedure } from "../../trpc";
import { addMiniappForUser, getMiniappByUrl, normalizeUrl } from "./apps.service";

const inputSchema = z.object({
  url: z.string().min(1),
  notificationsEnabled: z.boolean().optional().default(false),
});

export const addApp = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ ctx, input }) => {
    const normalizedUrl = normalizeUrl(input.url);

    // Verify the app exists in our database
    const app = await getMiniappByUrl(ctx.db)(normalizedUrl);
    if (!app) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "App not found. Please ensure the app is indexed first.",
      });
    }

    const result = await addMiniappForUser(ctx.db)(
      ctx.user.id,
      normalizedUrl,
      input.notificationsEnabled,
    );

    return result;
  });
