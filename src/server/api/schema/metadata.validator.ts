import { z } from "zod";
import type { Generation, Mint, User } from "~/server/db/schema";
import { createLiveApiUrl } from "~/services/url.service";
import { saveImageIpfs } from "~/server/ai/ai.image";

export const attributeSchema = z.object({
  trait_type: z.string(),
  value: z.string().or(z.number()),
  display_type: z
    .enum(["number", "boost_percentage", "boost_number", "boost_string"])
    .optional(),
});
export type Attribute = z.infer<typeof attributeSchema>;

export const metadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  external_url: z.string().url(),
  attributes: z.array(attributeSchema),
  generationId: z.string().uuid().optional(),
});
export type Metadata = z.infer<typeof metadataSchema>;

export const contractMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url(),
  banner_image: z.string().url(),
  external_link: z.string().url(),
});
export type ContractMetadata = z.infer<typeof contractMetadataSchema>;

export const erc20MetadataSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  image: z.string().url(),
});
export type Erc20Metadata = z.infer<typeof erc20MetadataSchema>;

export const createTokenMetadataFromGeneration = ({
  mint,
  user,
  generation,
}: {
  mint: Mint;
  user: User;
  generation: Generation;
}) => {
  return metadataSchema.parse({
    name: `${mint.config.metadataOptions.name} #${user.fid}`,
    description: `${mint.config.metadataOptions.description}`,
    image: generation.output?.ipfsCid ?? generation.output?.originalUrl ?? "",
    attributes: [
      // Generative Traits
      ...Object.entries(generation.output?.traits ?? {}).map(
        ([key, value]) => ({
          trait_type: key,
          value: value.metadata,
        }),
      ),
      ...Object.entries(mint.config.metadataOptions.fixedTraits ?? {}).map(
        ([trait_type, value]) => ({
          trait_type,
          value,
        }),
      ),
    ],
    generationId: generation.id,
    external_url: createLiveApiUrl(`/meta/gen/${generation.id}`),
  });
};

export const encodeTokenMetadata = (metadata: Metadata) => {
  const json = JSON.stringify(metadata);
  const base64 = Buffer.from(json).toString("base64");
  return `data:application/json;base64,${base64}`;
};

/**
 * Converts an image URL to an IPFS URI
 * If already an IPFS URI, returns as-is. Otherwise fetches and uploads to IPFS
 * @param url - Image URL to convert
 * @returns IPFS URI for the image
 */
const ensureIpfsUri = async (url: string): Promise<string> => {
  const isIpfsUri =
    url.startsWith("ipfs://") || url.startsWith("https://ipfs.io/ipfs/");

  if (isIpfsUri) {
    return url;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get("content-type") ?? "image/png";

  return await saveImageIpfs(buffer, contentType);
};

/**
 * Ensures image URLs are IPFS URIs and returns formatted contract metadata
 * If images are not already IPFS hashes, fetches and uploads them to IPFS
 * @param metadata - Contract metadata with potentially non-IPFS image URLs
 * @returns Contract metadata with IPFS URIs for images
 */
export const createContractMetadata = async (
  metadata: ContractMetadata,
): Promise<ContractMetadata> => {
  const [imageUri, bannerImageUri] = await Promise.all([
    ensureIpfsUri(metadata.image),
    ensureIpfsUri(metadata.banner_image),
  ]);

  return contractMetadataSchema.parse({
    name: metadata.name,
    description: metadata.description,
    image: imageUri,
    banner_image: bannerImageUri,
    external_link: metadata.external_link,
  });
};

export const encodeContractMetadata = (metadata: ContractMetadata) => {
  const json = JSON.stringify(metadata);
  const base64 = Buffer.from(json).toString("base64");
  return `data:application/json;base64,${base64}`;
};
