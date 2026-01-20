import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createSigner, lookupSigner } from "~/services/neynar.service";
import { farcasterSigners, users } from "~/server/db/schema";
import { env } from "~/env.app";

export const signersRouter = createTRPCRouter({
  // ============ SIGNER ENDPOINTS ============

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const [signer] = await ctx.db
      .select()
      .from(farcasterSigners)
      .where(eq(farcasterSigners.userId, ctx.user.id))
      .limit(1);
    return signer ?? null;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const [existing] = await ctx.db
      .select()
      .from(farcasterSigners)
      .where(eq(farcasterSigners.userId, ctx.user.id))
      .limit(1);

    if (existing) return existing;

    const signer = await createSigner();

    if (!ctx.user.fid) {
      throw new Error("User does not have a Farcaster account");
    }

    const [newSigner] = await ctx.db
      .insert(farcasterSigners)
      .values({
        userId: ctx.user.id,
        fid: ctx.user.fid,
        signerUuid: signer.signer_uuid,
        publicKey: signer.public_key,
        status: signer.status,
        approvalUrl: signer.signer_approval_url,
      })
      .returning();

    return newSigner!;
  }),

  checkApproval: protectedProcedure.mutation(async ({ ctx }) => {
    const [signer] = await ctx.db
      .select()
      .from(farcasterSigners)
      .where(eq(farcasterSigners.userId, ctx.user.id))
      .limit(1);

    if (!signer || signer.status === "approved") return signer ?? null;

    const result = await lookupSigner(signer.signerUuid);

    // Update status and approval URL if changed or missing
    const needsUpdate =
      result.status !== signer.status ||
      (!signer.approvalUrl && result.signer_approval_url);

    if (needsUpdate) {
      await ctx.db
        .update(farcasterSigners)
        .set({
          status: result.status,
          approvalUrl: result.signer_approval_url ?? signer.approvalUrl,
          approvedAt: result.status === "approved" ? new Date() : null,
        })
        .where(eq(farcasterSigners.id, signer.id));
    }

    return {
      ...signer,
      status: result.status,
      approvalUrl: result.signer_approval_url ?? signer.approvalUrl,
    };
  }),

  // ============ AUTH ADDRESS ENDPOINTS ============
  // Auth address = user's embedded wallet registered with Farcaster

  getAuthAddressTypedData: protectedProcedure.query(({ ctx }) => {
    if (!ctx.user.address) {
      throw new Error("No wallet address");
    }
    if (!ctx.user.fid) {
      throw new Error("User does not have a Farcaster account");
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 86400); // 24 hours
    const key = ctx.user.address.toLowerCase().padEnd(66, "0");

    return {
      domain: {
        name: "Farcaster SignedKeyRequestValidator",
        version: "1",
        chainId: 10,
        verifyingContract:
          "0x00000000fc700472606ed4fa22623acf62c60553" as const,
      },
      types: {
        SignedKeyRequest: [
          { name: "requestFid", type: "uint256" },
          { name: "key", type: "bytes" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "SignedKeyRequest" as const,
      message: {
        requestFid: BigInt(ctx.user.fid),
        key,
        deadline,
      },
      deadline: Number(deadline),
    };
  }),

  registerAuthAddress: protectedProcedure
    .input(z.object({ signature: z.string(), deadline: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.address) {
        throw new Error("No wallet address");
      }

      // Import neynar client for this specific API call
      const { neynar } = await import("~/services/neynar.service");

      const result =
        await neynar.registerSignedKeyForDeveloperManagedAuthAddress({
          address: ctx.user.address,
          signature: input.signature,
          appFid: Number(env.NEYNAR_APP_FID),
          deadline: input.deadline,
          sponsor: { sponsored_by_neynar: true },
        });

      // Update user's auth address status
      await ctx.db
        .update(users)
        .set({
          authAddressStatus:
            result.status === "approved" ? "approved" : "pending",
          authAddressApprovalUrl: result.auth_address_approval_url,
        })
        .where(eq(users.id, ctx.user.id));

      return { approvalUrl: result.auth_address_approval_url };
    }),

  checkAuthAddressApproval: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.address) {
      throw new Error("No wallet address");
    }
    if (!ctx.user.fid) {
      throw new Error("User does not have a Farcaster account");
    }

    const { getLiteFarcasterUser } = await import("~/services/neynar.service");
    const farcasterUser = await getLiteFarcasterUser(ctx.user.fid);

    // Check if wallet address is in user's auth_addresses
    const isApproved = farcasterUser.auth_addresses?.some(
      (addr) => String(addr).toLowerCase() === ctx.user.address?.toLowerCase(),
    );

    if (isApproved) {
      await ctx.db
        .update(users)
        .set({ authAddressStatus: "approved" })
        .where(eq(users.id, ctx.user.id));
    }

    return { status: isApproved ? "approved" : "pending" };
  }),
});
