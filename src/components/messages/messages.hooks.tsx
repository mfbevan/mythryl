"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ConversationType,
  IdentifierKind,
  ReactionAction,
  ReactionSchema,
  type Identifier,
  type Group,
  type Reaction,
} from "@xmtp/browser-sdk";

import { useMessagesClient } from "./messages.provider";
import { useMessagesStore } from "./messages.store";
import type { XmtpMessage } from "./messages.types";

const QUERY_KEYS = {
  conversations: ["xmtp", "conversations"] as const,
  messages: (conversationId: string) =>
    ["xmtp", "messages", conversationId] as const,
  canMessage: (identifiers: Identifier[]) =>
    ["xmtp", "canMessage", identifiers] as const,
};

export const useConversations = () => {
  const { client, isReady } = useMessagesClient();

  return useQuery({
    queryKey: QUERY_KEYS.conversations,
    queryFn: async () => {
      if (!client) throw new Error("XMTP client not ready");

      await client.conversations.sync();
      const conversations = await client.conversations.list();

      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conversation) => {
          const messages = await conversation.messages({ limit: 1n });
          const isDm = conversation.metadata?.conversationType === ConversationType.Dm;
          const isGroup = conversation.metadata?.conversationType === ConversationType.Group;

          // Get peer address for DMs
          let peerAddress: string | undefined;
          if (isDm) {
            try {
              const members = await conversation.members();
              const peer = members.find(
                (m) => m.inboxId !== client.inboxId
              );
              // GroupMember has accountIdentifiers, not addresses
              const peerIdentifier = peer?.accountIdentifiers?.[0];
              peerAddress = peerIdentifier?.identifier;
            } catch {
              // Ignore errors getting peer address
            }
          }

          // Get name for groups
          const name = isGroup ? (conversation as Group).name : undefined;

          return {
            conversation,
            lastMessage: messages[0],
            peerAddress,
            name,
            isGroup,
          };
        }),
      );

      return conversationsWithMessages.sort((a, b) => {
        const aTime = a.lastMessage?.sentAtNs ?? 0n;
        const bTime = b.lastMessage?.sentAtNs ?? 0n;
        return bTime > aTime ? 1 : bTime < aTime ? -1 : 0;
      });
    },
    enabled: isReady,
    staleTime: 30_000,
  });
};

export const useConversationMessages = (conversationId: string | null) => {
  const { client, isReady } = useMessagesClient();

  return useQuery({
    queryKey: QUERY_KEYS.messages(conversationId ?? ""),
    queryFn: async () => {
      if (!client || !conversationId)
        throw new Error("XMTP client not ready or no conversation");

      const conversation =
        await client.conversations.getConversationById(conversationId);
      if (!conversation) throw new Error("Conversation not found");

      await conversation.sync();
      const messages = await conversation.messages();

      return messages;
    },
    enabled: isReady && !!conversationId,
    staleTime: 10_000,
  });
};

export const useSendMessage = () => {
  const { client } = useMessagesClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      if (!client) throw new Error("XMTP client not ready");

      const conversation =
        await client.conversations.getConversationById(conversationId);
      if (!conversation) throw new Error("Conversation not found");

      await conversation.sendText(content);
    },
    onSuccess: (_, { conversationId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations,
      });
    },
  });
};

export const useCreateDm = () => {
  const { client } = useMessagesClient();
  const queryClient = useQueryClient();
  const { setActiveConversation } = useMessagesStore();

  return useMutation({
    mutationFn: async (peerAddress: string) => {
      if (!client) throw new Error("XMTP client not ready");

      const identifier: Identifier = {
        identifier: peerAddress.toLowerCase(),
        identifierKind: IdentifierKind.Ethereum,
      };
      const conversation =
        await client.conversations.createDmWithIdentifier(identifier);
      return conversation;
    },
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations,
      });
      setActiveConversation(conversation.id);
    },
  });
};

export const useCreateGroup = () => {
  const { client } = useMessagesClient();
  const queryClient = useQueryClient();
  const { setActiveConversation } = useMessagesStore();

  return useMutation({
    mutationFn: async ({
      memberAddresses,
      groupName,
    }: {
      memberAddresses: string[];
      groupName?: string;
    }) => {
      if (!client) throw new Error("XMTP client not ready");

      const identifiers: Identifier[] = memberAddresses.map((address) => ({
        identifier: address.toLowerCase(),
        identifierKind: IdentifierKind.Ethereum,
      }));
      const group = await client.conversations.createGroupWithIdentifiers(
        identifiers,
        groupName ? { groupName } : undefined,
      );
      return group;
    },
    onSuccess: (group) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations,
      });
      setActiveConversation(group.id);
    },
  });
};

export const useReaction = () => {
  const { client } = useMessagesClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
      referenceInboxId,
      emoji,
      action,
    }: {
      conversationId: string;
      messageId: string;
      referenceInboxId: string;
      emoji: string;
      action: "added" | "removed";
    }) => {
      if (!client) throw new Error("XMTP client not ready");

      const conversation =
        await client.conversations.getConversationById(conversationId);
      if (!conversation) throw new Error("Conversation not found");

      // Use sendReaction method with proper enum types
      const reaction: Reaction = {
        reference: messageId,
        referenceInboxId,
        action: action === "added" ? ReactionAction.Added : ReactionAction.Removed,
        content: emoji,
        schema: ReactionSchema.Unicode,
      };
      await conversation.sendReaction(reaction);
    },
    onSuccess: (_, { conversationId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
    },
  });
};

export const useCanMessage = (identifiers: Identifier[]) => {
  const { client, isReady } = useMessagesClient();

  return useQuery({
    queryKey: QUERY_KEYS.canMessage(identifiers),
    queryFn: async () => {
      if (!client) throw new Error("XMTP client not ready");

      const results = await client.canMessage(identifiers);
      return results;
    },
    enabled: isReady && identifiers.length > 0,
    staleTime: 60_000,
  });
};

export const useMessageStream = () => {
  const { client, isReady } = useMessagesClient();
  const queryClient = useQueryClient();
  const { incrementUnreadCount, activeConversationId } = useMessagesStore();
  const streamRef = useRef<AsyncIterable<XmtpMessage> | null>(null);
  const isStreamingRef = useRef(false);

  useEffect(() => {
    if (!isReady || !client || isStreamingRef.current) return;

    const startStream = async () => {
      isStreamingRef.current = true;

      try {
        const stream = await client.conversations.streamAllMessages();
        streamRef.current = stream;

        for await (const message of stream) {
          const conversationId = message.conversationId;

          // Invalidate queries for new messages
          void queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.messages(conversationId),
          });
          void queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.conversations,
          });

          // Track unread for messages not in active conversation
          if (conversationId !== activeConversationId) {
            incrementUnreadCount(conversationId);
          }
        }
      } catch (error) {
        console.error("Message stream error:", error);
        isStreamingRef.current = false;
      }
    };

    void startStream();

    return () => {
      isStreamingRef.current = false;
      streamRef.current = null;
    };
  }, [
    isReady,
    client,
    queryClient,
    incrementUnreadCount,
    activeConversationId,
  ]);
};

export const useActiveConversation = () => {
  const { activeConversationId, setActiveConversation } = useMessagesStore();
  const { client, isReady } = useMessagesClient();

  const conversationQuery = useQuery({
    queryKey: ["xmtp", "conversation", activeConversationId],
    queryFn: async () => {
      if (!client || !activeConversationId) return null;

      const conversation =
        await client.conversations.getConversationById(activeConversationId);
      if (!conversation) return null;

      const isDm = conversation.metadata?.conversationType === ConversationType.Dm;
      const isGroup = conversation.metadata?.conversationType === ConversationType.Group;

      // Get peer address for DMs
      let peerAddress: string | undefined;
      if (isDm) {
        try {
          const members = await conversation.members();
          const peer = members.find((m) => m.inboxId !== client.inboxId);
          const peerIdentifier = peer?.accountIdentifiers?.[0];
          peerAddress = peerIdentifier?.identifier;
        } catch {
          // Ignore errors getting peer address
        }
      }

      // Get name for groups
      const name = isGroup ? (conversation as Group).name : undefined;

      return { conversation, peerAddress, name, isGroup };
    },
    enabled: isReady && !!activeConversationId,
  });

  const conversation = conversationQuery.data?.conversation;
  const peerAddress = conversationQuery.data?.peerAddress;
  const isGroup = conversationQuery.data?.isGroup;
  const name = conversationQuery.data?.name;

  // Format display name
  const displayName = name
    ?? (isGroup ? "Group" : null)
    ?? (peerAddress ? `${peerAddress.slice(0, 6)}...${peerAddress.slice(-4)}` : "Chat");

  return {
    conversationId: activeConversationId,
    conversation,
    peerAddress,
    displayName,
    setActiveConversation,
    isLoading: conversationQuery.isLoading,
  };
};
