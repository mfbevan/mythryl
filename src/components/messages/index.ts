// Types
export type {
  XmtpClient,
  XmtpConversation,
  XmtpMessage,
  XmtpReaction,
  XmtpClientStatus,
  XmtpState,
  ConversationWithLastMessage,
  MessageWithReactions,
} from "./messages.types";

// Store
export { useMessagesStore, type MessagesStore } from "./messages.store";

// Provider
export {
  MessagesProvider,
  useMessages,
  useMessagesClient,
} from "./messages.provider";

// Hooks
export {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useCreateDm,
  useCreateGroup,
  useReaction,
  useCanMessage,
  useMessageStream,
  useActiveConversation,
} from "./messages.hooks";

// Components
export {
  ConversationsList,
  NewConversationButton,
} from "./messages.conversations";
export { NewConversationMenu } from "./messages.groups";
export { ChatView } from "./messages.chat";
export { MessageReactions, ReactionDisplay } from "./messages.reactions";
