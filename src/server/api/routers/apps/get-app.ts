import z from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import {
  farcasterManifestSchema,
  type ResolvedFarcasterApp,
} from "../../schema/farcaster-manifest.validator";

const inputSchema = z.object({
  url: z.string().min(1),
});

export const getApp = publicProcedure
  .input(inputSchema)
  .query(async ({ input }): Promise<ResolvedFarcasterApp> => {
    // Strip protocol if present, then add https for fetching
    const domain = input.url.replace(/^https?:\/\//, "").split("/")[0]!;
    const manifestUrl = `https://${domain}/.well-known/farcaster.json`;

    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Failed to fetch manifest from ${manifestUrl}`,
      });
    }

    const json = await response.json();
    const manifest = farcasterManifestSchema.parse(json);

    const config = manifest.frame ?? manifest.miniApp;
    if (!config) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Manifest does not contain a frame or miniApp configuration",
      });
    }

    return {
      domain,
      config,
    };
  });
