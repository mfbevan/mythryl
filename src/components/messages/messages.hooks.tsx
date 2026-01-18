"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ContentTypeReaction,
  type Reaction,
} from "@xmtp/content-type-reaction";
import { toast } from "sonner";

import { useMessages, useMessagesClient } from "./messages.provider";
import { useMessagesStore } from "./messages.store";
import type { XmtpConversation, XmtpMessage } from "./messages.types";

const QUERY_KEYS = {
  conversations: ["xmtp", "conversations"] as const,
  messages: (conversationId: string) =>
    ["xmtp", "messages", conversationId] as const,
  canMessage: (addresses: string[]) =>
    ["xmtp", "canMessage", addresses] as const,
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
          return {
            conversation,
            lastMessage: messages[0],
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
  const { client, isReady } = useMessagesClient();
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

      await conversation.send(content);
    },
    onSuccess: (_, { conversationId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations,
      });
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
};

export const useCreateDm = () => {
  const { client, isReady } = useMessagesClient();
  const queryClient = useQueryClient();
  const { setActiveConversation } = useMessagesStore();

  return useMutation({
    mutationFn: async (peerAddress: string) => {
      if (!client) throw new Error("XMTP client not ready");

      const conversation = await client.conversations.newDm(peerAddress);
      return conversation;
    },
    onSuccess: (conversation) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations,
      });
      setActiveConversation(conversation.id);
    },
    onError: (error) => {
      toast.error("Failed to create conversation", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
};

export const useCreateGroup = () => {
  const { client, isReady } = useMessagesClient();
  const queryClient = useQueryClient();
  const { setActiveConversation } = useMessagesStore();

  return useMutation({
    mutationFn: async ({
      memberAddresses,
      name,
    }: {
      memberAddresses: string[];
      name?: string;
    }) => {
      if (!client) throw new Error("XMTP client not ready");

      const group = await client.conversations.newGroup(memberAddresses, {
        name,
      });
      return group;
    },
    onSuccess: (group) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations,
      });
      setActiveConversation(group.id);
      toast.success("Group created");
    },
    onError: (error) => {
      toast.error("Failed to create group", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
};

export const useReaction = () => {
  const { client, isReady } = useMessagesClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
      emoji,
      action,
    }: {
      conversationId: string;
      messageId: string;
      emoji: string;
      action: "added" | "removed";
    }) => {
      if (!client) throw new Error("XMTP client not ready");

      const conversation =
        await client.conversations.getConversationById(conversationId);
      if (!conversation) throw new Error("Conversation not found");

      const reaction: Reaction = {
        reference: messageId,
        action,
        content: emoji,
        schema: "unicode",
      };

      await conversation.send(reaction, ContentTypeReaction);
    },
    onSuccess: (_, { conversationId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
    },
    onError: (error) => {
      toast.error("Failed to add reaction", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
};

export const useCanMessage = (addresses: string[]) => {
  const { client, isReady } = useMessagesClient();

  return useQuery({
    queryKey: QUERY_KEYS.canMessage(addresses),
    queryFn: async () => {
      if (!client) throw new Error("XMTP client not ready");

      const results = await client.canMessage(addresses);
      return results;
    },
    enabled: isReady && addresses.length > 0,
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

          // Show notification for messages not in active conversation
          if (conversationId !== activeConversationId) {
            incrementUnreadCount(conversationId);

            // Show toast notification
            toast.info("New message", {
              description:
                typeof message.content === "string"
                  ? message.content.slice(0, 50)
                  : "New message received",
            });
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

  const conversation = useQuery({
    queryKey: ["xmtp", "conversation", activeConversationId],
    queryFn: async () => {
      if (!client || !activeConversationId) return null;
      return client.conversations.getConversationById(activeConversationId);
    },
    enabled: isReady && !!activeConversationId,
  });

  return {
    conversationId: activeConversationId,
    conversation: conversation.data,
    setActiveConversation,
    isLoading: conversation.isLoading,
  };
};
