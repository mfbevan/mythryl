import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users, type OnboardingStatus } from "~/server/db/schema";

export const onboardingRouter = createTRPCRouter({
  /**
   * Get current onboarding status for the authenticated user
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({
        onboardingStatus: users.onboardingStatus,
        address: users.address,
        authAddressStatus: users.authAddressStatus,
        authAddressApprovalUrl: users.authAddressApprovalUrl,
      })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    return {
      status: user?.onboardingStatus ?? "pending",
      address: user?.address ?? null,
      authAddressStatus: user?.authAddressStatus ?? null,
      authAddressApprovalUrl: user?.authAddressApprovalUrl ?? null,
    };
  }),

  /**
   * Save wallet address after client-side wallet creation
   */
  setWalletAddress: protectedProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          address: input.address,
          onboardingStatus: "wallet_created",
        })
        .where(eq(users.id, ctx.user.id));

      return { address: input.address };
    }),

  /**
   * Update onboarding status
   */
  updateStatus: protectedProcedure
    .input((val: unknown) => {
      const status = val as OnboardingStatus;
      const validStatuses: OnboardingStatus[] = [
        "pending",
        "wallet_created",
        "signer_pending",
        "signer_approved",
        "auth_address_pending",
        "complete",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid onboarding status: ${status}`);
      }
      return status;
    })
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ onboardingStatus: input })
        .where(eq(users.id, ctx.user.id));

      return { status: input };
    }),

  /**
   * Mark onboarding as complete
   */
  complete: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(users)
      .set({ onboardingStatus: "complete" })
      .where(eq(users.id, ctx.user.id));

    return { status: "complete" as const };
  }),
});
