"use client";

import { useState } from "react";
import { SmilePlus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { useReaction } from "./messages.hooks";
import type { XmtpMessage } from "./messages.types";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

interface MessageReactionsProps {
  message: XmtpMessage;
  conversationId: string;
  isOwn: boolean;
}

export const MessageReactions = ({
  message,
  conversationId,
  isOwn,
}: MessageReactionsProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const reaction = useReaction();

  const handleReaction = async (emoji: string) => {
    setShowPicker(false);
    await reaction.mutateAsync({
      conversationId,
      messageId: message.id,
      emoji,
      action: "added",
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="relative">
        <Button
          variant="ghost"
          size="iconXs"
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => setShowPicker(!showPicker)}
        >
          <SmilePlus className="size-3" />
        </Button>

        {showPicker && (
          <ReactionPicker
            onSelect={handleReaction}
            onClose={() => setShowPicker(false)}
            isOwn={isOwn}
          />
        )}
      </div>
    </div>
  );
};

const ReactionPicker = ({
  onSelect,
  onClose,
  isOwn,
}: {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  isOwn: boolean;
}) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={cn(
          "bg-popover absolute z-50 flex gap-1 rounded-full border p-1 shadow-lg",
          isOwn ? "right-0" : "left-0"
        )}
      >
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="hover:bg-accent rounded-full p-1 text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};

interface ReactionDisplayProps {
  reactions: Array<{ emoji: string; count: number }>;
  conversationId: string;
  messageId: string;
}

export const ReactionDisplay = ({
  reactions,
  conversationId,
  messageId,
}: ReactionDisplayProps) => {
  const reaction = useReaction();

  if (!reactions.length) return null;

  const handleToggle = async (emoji: string) => {
    await reaction.mutateAsync({
      conversationId,
      messageId,
      emoji,
      action: "removed",
    });
  };

  return (
    <div className="flex flex-wrap gap-1">
      {reactions.map(({ emoji, count }) => (
        <button
          key={emoji}
          onClick={() => handleToggle(emoji)}
          className="bg-muted hover:bg-accent flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors"
        >
          <span>{emoji}</span>
          {count > 1 && <span className="text-muted-foreground">{count}</span>}
        </button>
      ))}
    </div>
  );
};
