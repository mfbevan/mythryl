import type { Client, DecodedMessage } from "@xmtp/browser-sdk";
import type { Reaction } from "@xmtp/content-type-reaction";

// Use unknown for content types to allow any codec configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type XmtpClient = Client<any>;
export type XmtpMessage = DecodedMessage;
export type XmtpReaction = Reaction;

export type XmtpClientStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface XmtpState {
  client: XmtpClient | null;
  status: XmtpClientStatus;
  error: Error | null;
}
