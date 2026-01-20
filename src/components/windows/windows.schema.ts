import z from "zod";
import { zAddress } from "~/server/api/schema/address.validator";

export const walletWindowSchema = z.object({
  type: z.literal("wallet"),
});
export type WalletWindow = z.infer<typeof walletWindowSchema>;

export const miniappWindowSchema = z.object({
  type: z.literal("miniapp"),
  url: z.string(),
});
export type MiniappWindow = z.infer<typeof miniappWindowSchema>;

export const previewWindowSchema = z.object({
  type: z.literal("preview"),
  url: z.string(),
});
export type PreviewWindow = z.infer<typeof previewWindowSchema>;

export const messageWindowSchema = z.object({
  type: z.literal("message"),
});
export type MessageWindow = z.infer<typeof messageWindowSchema>;

export const tokenWindowSchema = z.object({
  type: z.literal("token"),
  chainId: z.number(),
  address: zAddress,
});
export type TokenWindow = z.infer<typeof tokenWindowSchema>;

export const conversationWindowSchema = z.object({
  type: z.literal("conversation"),
  recipientId: z.string(),
  recipientName: z.string(),
});
export type ConversationWindow = z.infer<typeof conversationWindowSchema>;

export const windowSchema = z.discriminatedUnion("type", [
  walletWindowSchema,
  miniappWindowSchema,
  previewWindowSchema,
  messageWindowSchema,
  tokenWindowSchema,
  conversationWindowSchema,
]);
export type Window = z.infer<typeof windowSchema>;

export interface WindowInstance {
  key: string;
  window: Window;
  isOpen: boolean;
  order: number;
  isPoppedOut?: boolean;
}
