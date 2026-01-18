"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ConversationWindowContentProps {
  recipientId: string;
  recipientName: string;
}

const DUMMY_MESSAGES: Record<string, { id: string; text: string; fromMe: boolean; time: string }[]> = {
  "1": [
    { id: "1", text: "gm!", fromMe: false, time: "10:30 AM" },
    { id: "2", text: "gm gm!", fromMe: true, time: "10:31 AM" },
    { id: "3", text: "have you seen the latest EIP proposal?", fromMe: false, time: "10:32 AM" },
    { id: "4", text: "not yet, sending link?", fromMe: true, time: "10:33 AM" },
  ],
  "2": [
    { id: "1", text: "hey, working on something cool", fromMe: false, time: "9:00 AM" },
    { id: "2", text: "oh nice, what is it?", fromMe: true, time: "9:15 AM" },
    { id: "3", text: "that's a great idea for the app!", fromMe: false, time: "9:20 AM" },
  ],
  "3": [
    { id: "1", text: "check out the new feature", fromMe: false, time: "Yesterday" },
    { id: "2", text: "looks amazing!", fromMe: true, time: "Yesterday" },
    { id: "3", text: "shipped it!", fromMe: false, time: "1h ago" },
  ],
};

export function ConversationWindowContent({ recipientId, recipientName }: ConversationWindowContentProps) {
  const [message, setMessage] = useState("");
  const messages = DUMMY_MESSAGES[recipientId] ?? [
    { id: "1", text: `Start a conversation with ${recipientName}`, fromMe: false, time: "Now" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.fromMe ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2",
                msg.fromMe
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={cn(
                "text-[10px] mt-1",
                msg.fromMe ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
        />
        <Button size="icon" className="rounded-full shrink-0">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
