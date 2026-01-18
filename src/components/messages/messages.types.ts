import type { Client, Conversation, DecodedMessage } from "@xmtp/browser-sdk";
import type { Reaction } from "@xmtp/content-type-reaction";

export type XmtpClient = Client;
export type XmtpConversation = Conversation;
export type XmtpMessage = DecodedMessage;
export type XmtpReaction = Reaction;

export interface ConversationWithLastMessage {
  conversation: XmtpConversation;
  lastMessage?: XmtpMessage;
  unreadCount: number;
}

export interface MessageWithReactions {
  message: XmtpMessage;
  reactions: XmtpReaction[];
}

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
