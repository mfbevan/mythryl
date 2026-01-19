"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useConversations, useMessages } from "~/components/messages";
import { useWindowActions } from "../provider";

export const MessageWindowContent = () => {
  const { status, connect, error } = useMessages();
  const { data: conversations, isLoading } = useConversations();
  const { addWindow } = useWindowActions();

  const openConversation = (id: string, name: string) => {
    addWindow({ type: "conversation", recipientId: id, recipientName: name });
  };

  if (status === "disconnected") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
        <MessageSquare className="text-muted-foreground size-8" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Connect to XMTP</p>
          <p className="text-muted-foreground text-xs">
            Enable messaging to chat
          </p>
        </div>
        <Button size="sm" onClick={connect}>
          Enable
        </Button>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
        <MessageSquare className="text-muted-foreground size-8 animate-pulse" />
        <p className="text-muted-foreground text-xs">Connecting...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
        <MessageSquare className="size-8 text-destructive" />
        <p className="text-muted-foreground text-xs">
          {error?.message ?? "Connection failed"}
        </p>
        <Button size="sm" variant="outline" onClick={connect}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-14 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
        <MessageSquare className="text-muted-foreground size-8" />
        <p className="text-muted-foreground text-xs">No conversations yet</p>
        <NewConversationDropdown />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end border-b px-3 py-2">
        <NewConversationDropdown />
      </div>
      <div className="flex-1 overflow-auto">
        {conversations.map(({ conversation, lastMessage, peerAddress, name, isGroup }) => {
          // Format display name
          const displayName = name
            ?? (isGroup ? "Group" : null)
            ?? (peerAddress ? `${peerAddress.slice(0, 6)}...${peerAddress.slice(-4)}` : "Chat");

          return (
            <div
              key={conversation.id}
              onClick={() => openConversation(conversation.id, displayName)}
              className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 border-b px-3 py-2 last:border-b-0"
            >
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
                {isGroup ? (
                  <Users className="size-4" />
                ) : (
                  <MessageSquare className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{displayName}</p>
                {lastMessage && typeof lastMessage.content === "string" && (
                  <p className="text-muted-foreground truncate text-xs">
                    {lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NewConversationDropdown = () => {
  const [mounted, setMounted] = useState(false);
  const { isReady } = useMessages();
  const { addWindow } = useWindowActions();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewMessage = () => {
    addWindow({ type: "conversation", recipientId: "new", recipientName: "New Message" });
  };

  if (!mounted) {
    return (
      <Button size="iconXs" variant="ghost" disabled>
        <Plus className="size-3" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="iconXs" variant="ghost" disabled={!isReady}>
          <Plus className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleNewMessage}>
          <MessageSquare className="size-3" />
          New Message
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNewMessage}>
          <Users className="size-3" />
          New Group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
