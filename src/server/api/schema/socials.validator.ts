import z from "zod";

export const socialSchema = z.union([
  z.object({
    type: z.literal("website"),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal("twitter"),
    username: z.string(),
  }),
  z.object({
    type: z.literal("farcaster-profile"),
    username: z.string(),
    fid: z.number(),
  }),
  z.object({
    type: z.literal("farcaster-channel"),
    channelId: z.string(),
  }),
  z.object({
    type: z.literal("telegram"),
    username: z.string(),
  }),
  z.object({
    type: z.literal("github"),
    username: z.string(),
  }),
  z.object({
    type: z.literal("empire"),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal("miniapp"),
    url: z.string().url(),
  }),
]);
export type Social = z.infer<typeof socialSchema>;
