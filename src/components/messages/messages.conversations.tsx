"use client";

import { MessageSquare, Plus, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { useMessages } from "./messages.provider";
import { useConversations, useMessageStream } from "./messages.hooks";
import { useMessagesStore } from "./messages.store";

export const ConversationsList = () => {
  const { status, connect, error } = useMessages();
  const { data: conversations, isLoading } = useConversations();
  const { activeConversationId, setActiveConversation, unreadCounts } = useMessagesStore();

  // Start message stream when ready
  useMessageStream();

  if (status === "disconnected") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <MessageSquare className="text-muted-foreground size-12" />
        <div className="space-y-2">
          <h3 className="font-semibold">Connect to XMTP</h3>
          <p className="text-muted-foreground text-sm">
            Enable messaging to chat with other users
          </p>
        </div>
        <Button onClick={connect}>
          Enable Messaging
        </Button>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <MessageSquare className="text-muted-foreground size-12 animate-pulse" />
        <p className="text-muted-foreground text-sm">Connecting to XMTP...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <MessageSquare className="size-12 text-destructive" />
        <div className="space-y-2">
          <h3 className="font-semibold">Connection Error</h3>
          <p className="text-muted-foreground text-sm">
            {error?.message ?? "Failed to connect to XMTP"}
          </p>
        </div>
        <Button onClick={connect} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <MessageSquare className="text-muted-foreground size-12" />
        <div className="space-y-2">
          <h3 className="font-semibold">No conversations</h3>
          <p className="text-muted-foreground text-sm">
            Start a new conversation to begin messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map(({ conversation, lastMessage, peerAddress, name, isGroup }) => {
        const isActive = activeConversationId === conversation.id;
        const unreadCount = unreadCounts.get(conversation.id) ?? 0;

        // Format display name
        const displayName = name
          ?? (isGroup ? "Group" : null)
          ?? (peerAddress ? `${peerAddress.slice(0, 6)}...${peerAddress.slice(-4)}` : "Chat");

        return (
          <button
            key={conversation.id}
            onClick={() => setActiveConversation(conversation.id)}
            className={cn(
              "flex items-center gap-3 p-3 text-left transition-colors hover:bg-accent",
              isActive && "bg-accent"
            )}
          >
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
              {isGroup ? (
                <Users className="size-5" />
              ) : (
                <MessageSquare className="size-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">
                  {displayName}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </div>
              {lastMessage && typeof lastMessage.content === "string" && (
                <p className="text-muted-foreground truncate text-sm">
                  {lastMessage.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const NewConversationButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      variant="ghost"
      className="size-8"
    >
      <Plus className="size-4" />
    </Button>
  );
};
