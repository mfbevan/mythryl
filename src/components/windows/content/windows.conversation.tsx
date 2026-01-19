"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  useConversationMessages,
  useSendMessage,
  useCreateDm,
  useMessagesClient,
} from "~/components/messages";
import type { XmtpMessage } from "~/components/messages";

interface ConversationWindowContentProps {
  recipientId: string;
  recipientName: string;
}

export const ConversationWindowContent = ({
  recipientId,
}: ConversationWindowContentProps) => {
  const { isReady } = useMessagesClient();

  // Handle "new" conversation case
  if (recipientId === "new") {
    return <NewConversationView />;
  }

  if (!isReady) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground text-xs">Connecting...</p>
      </div>
    );
  }

  return <ConversationView conversationId={recipientId} />;
};

const NewConversationView = () => {
  const [address, setAddress] = useState("");
  const createDm = useCreateDm();

  const handleCreate = async () => {
    if (!address.trim()) return;
    await createDm.mutateAsync(address.trim());
  };

  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-medium">Start a new conversation</p>
        <Input
          placeholder="Enter wallet address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="max-w-xs text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleCreate();
            }
          }}
        />
        <Button
          size="sm"
          onClick={handleCreate}
          isLoading={createDm.isPending}
          disabled={!address.trim()}
        >
          Start Chat
        </Button>
      </div>
    </div>
  );
};

const ConversationView = ({ conversationId }: { conversationId: string }) => {
  const { data: messages, isLoading } = useConversationMessages(conversationId);
  const { client } = useMessagesClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-auto p-3">
        {messages?.length === 0 && (
          <p className="text-muted-foreground text-center text-xs">
            No messages yet
          </p>
        )}
        {messages?.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderInboxId === client?.inboxId}
          />
        ))}
      </div>
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

const MessageBubble = ({
  message,
  isOwn,
}: {
  message: XmtpMessage;
  isOwn: boolean;
}) => {
  const content = message.content;

  // Skip non-text messages (reactions, group membership changes, etc.)
  if (typeof content !== "string") {
    return null;
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-1.5",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm"
        )}
      >
        <p className="text-sm break-words">{content}</p>
      </div>
    </div>
  );
};

const MessageInput = ({ conversationId }: { conversationId: string }) => {
  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessage("");
    await sendMessage.mutateAsync({
      conversationId,
      content: trimmed,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message..."
        className="flex-1 text-sm"
        disabled={sendMessage.isPending}
      />
      <Button
        type="submit"
        size="icon"
        className="shrink-0"
        disabled={!message.trim() || sendMessage.isPending}
        isLoading={sendMessage.isPending}
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
};
