"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import {
  useActiveConversation,
  useConversationMessages,
  useSendMessage,
} from "./messages.hooks";
import { useMessagesStore } from "./messages.store";
import { MessageReactions } from "./messages.reactions";
import type { XmtpMessage } from "./messages.types";

export const ChatView = () => {
  const { conversationId, conversation, setActiveConversation, isLoading } =
    useActiveConversation();
  const { data: messages, isLoading: messagesLoading } =
    useConversationMessages(conversationId);

  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  if (isLoading || messagesLoading) {
    return (
      <div className="flex h-full flex-col">
        <ChatHeader
          title="Loading..."
          onBack={() => setActiveConversation(null)}
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-muted size-8 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        title={conversation?.name ?? "Conversation"}
        onBack={() => setActiveConversation(null)}
      />
      <MessageList messages={messages ?? []} conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

const ChatHeader = ({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) => {
  return (
    <div className="flex items-center gap-3 border-b p-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="size-5" />
      </Button>
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
};

const MessageList = ({
  messages,
  conversationId,
}: {
  messages: XmtpMessage[];
  conversationId: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const account = useActiveAccount();
  const myAddress = account?.address?.toLowerCase();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderInboxId?.toLowerCase() === myAddress}
            conversationId={conversationId}
          />
        ))}
      </div>
    </div>
  );
};

const MessageBubble = ({
  message,
  isOwn,
  conversationId,
}: {
  message: XmtpMessage;
  isOwn: boolean;
  conversationId: string;
}) => {
  const content = message.content;

  // Skip reaction messages in the main list
  if (typeof content === "object" && content !== null && "reference" in content) {
    return null;
  }

  return (
    <div
      className={cn(
        "group flex flex-col gap-1",
        isOwn ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="break-words text-sm">
          {typeof content === "string" ? content : "Unsupported message type"}
        </p>
      </div>
      <MessageReactions
        message={message}
        conversationId={conversationId}
        isOwn={isOwn}
      />
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
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
        disabled={sendMessage.isPending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || sendMessage.isPending}
        isLoading={sendMessage.isPending}
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
};
