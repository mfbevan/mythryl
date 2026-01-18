import z from "zod";

export const farcasterAppConfigSchema = z.object({
  version: z.string().optional(),
  name: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  homeUrl: z.string().url(),
  iconUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
  heroImageUrl: z.string().url().optional(),
  buttonTitle: z.string().optional(),
  tagline: z.string().optional(),
  splashImageUrl: z.string().url().optional(),
  splashBackgroundColor: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  primaryCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageUrl: z.string().url().optional(),
  canonicalDomain: z.string().optional(),
});
export type FarcasterAppConfig = z.infer<typeof farcasterAppConfigSchema>;

export const farcasterAccountAssociationSchema = z.object({
  header: z.string(),
  payload: z.string(),
  signature: z.string(),
});
export type FarcasterAccountAssociation = z.infer<typeof farcasterAccountAssociationSchema>;

export const farcasterBaseBuilderSchema = z.object({
  allowedAddresses: z.array(z.string()).optional(),
});
export type FarcasterBaseBuilder = z.infer<typeof farcasterBaseBuilderSchema>;

export const farcasterManifestSchema = z.object({
  baseBuilder: farcasterBaseBuilderSchema.optional(),
  accountAssociation: farcasterAccountAssociationSchema.optional(),
  frame: farcasterAppConfigSchema.optional(),
  miniApp: farcasterAppConfigSchema.optional(),
});
export type FarcasterManifest = z.infer<typeof farcasterManifestSchema>;

export const resolvedFarcasterAppSchema = z.object({
  domain: z.string(),
  config: farcasterAppConfigSchema,
  accountAssociation: farcasterAccountAssociationSchema.optional(),
  baseBuilder: farcasterBaseBuilderSchema.optional(),
});
export type ResolvedFarcasterApp = z.infer<typeof resolvedFarcasterAppSchema>;
