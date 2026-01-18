import sdk from "@farcaster/miniapp-sdk";
import type { CreatorAccount, Mint } from "~/server/db/schema";
import { createLiveUrl } from "./url.service";

const createMintEmbedUrl = (mintId: string, generationId?: string) => {
  const baseUrl = `/mint/${mintId}`;
  if (generationId) {
    return createLiveUrl(`${baseUrl}?generationId=${generationId}`);
  }
  return createLiveUrl(baseUrl);
};

export const shareMint = (
  mint: Mint,
  creator: CreatorAccount,
  imageUrl?: string,
  generationId?: string,
) => {
  if (imageUrl) {
    return sdk.actions.composeCast({
      text:
        mint.config.share?.minted ||
        `I just minted ${mint.config.name} by @${creator.username} on Immutagen!
Generate yours and mint to reveal it!`,
      embeds: [imageUrl, createMintEmbedUrl(mint.id, generationId)],
    });
  }

  return sdk.actions.composeCast({
    text: `Check out the ${mint.config.name} NFT Mint by @${creator.username} on Immutagen!`,
    embeds: [createMintEmbedUrl(mint.id, generationId)],
  });
};
