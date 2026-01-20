import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../../trpc";
import { neynar } from "~/services/neynar.service";
import { farcasterSigners } from "~/server/db/schema";
import { castInteractionInputSchema } from "./feed.schema";

export const unrecast = protectedProcedure
  .input(castInteractionInputSchema)
  .mutation(async ({ ctx, input }) => {
    const { castHash } = input;

    // Look up user's approved signer
    const [signer] = await ctx.db
      .select()
      .from(farcasterSigners)
      .where(eq(farcasterSigners.userId, ctx.user.id))
      .limit(1);

    if (signer?.status !== "approved") {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Signer not approved. Please complete Farcaster setup first.",
      });
    }

    try {
      const response = await neynar.deleteReaction({
        signerUuid: signer.signerUuid,
        reactionType: "recast",
        target: castHash,
      });

      return {
        success: response.success,
        hash: castHash,
      };
    } catch (error) {
      console.error("[Feed] Error removing recast:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove recast",
      });
    }
  });
