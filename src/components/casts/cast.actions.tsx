"use client";

import {
  Heart,
  MessageCircle,
  Repeat2,
  Quote,
  Bookmark,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { Reactions, Replies, ViewerContext, FeedType } from "~/server/api/routers/feed/feed.schema";
import { useCastInteractions } from "./cast.hooks";

interface CastActionsProps {
  hash: string;
  reactions: Reactions;
  replies: Replies;
  viewerContext?: ViewerContext;
  feedType?: FeedType;
}

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export const CastActions = ({
  hash,
  reactions,
  replies,
  viewerContext,
  feedType,
}: CastActionsProps) => {
  const { handleLike, handleRecast, isLiking, isRecasting } = useCastInteractions({
    feedType,
  });

  const isLiked = viewerContext?.liked ?? false;
  const isRecasted = viewerContext?.recasted ?? false;

  return (
    <div
      className="flex w-full items-center justify-between"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Reply - count only, not clickable */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-muted-foreground"
        disabled
      >
        <MessageCircle className="size-4" />
        {replies.count > 0 && (
          <span className="text-xs">{formatCount(replies.count)}</span>
        )}
      </Button>

      {/* Recast - functional */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 gap-1.5 px-2",
          isRecasted
            ? "text-emerald-400 hover:text-emerald-300"
            : "text-muted-foreground hover:text-emerald-400"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRecast(hash, isRecasted);
        }}
        disabled={isRecasting}
      >
        <Repeat2 className={cn("size-4", isRecasted && "fill-current")} />
        {reactions.recasts_count > 0 && (
          <span className="text-xs">{formatCount(reactions.recasts_count)}</span>
        )}
      </Button>

      {/* Like - functional */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 gap-1.5 px-2",
          isLiked
            ? "text-rose-400 hover:text-rose-300"
            : "text-muted-foreground hover:text-rose-400"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLike(hash, isLiked);
        }}
        disabled={isLiking}
      >
        <Heart className={cn("size-4", isLiked && "fill-current")} />
        {reactions.likes_count > 0 && (
          <span className="text-xs">{formatCount(reactions.likes_count)}</span>
        )}
      </Button>

      {/* Quote - placeholder, disabled */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 px-2 text-muted-foreground opacity-50"
        disabled
      >
        <Quote className="size-4" />
      </Button>

      {/* Bookmark - placeholder, disabled */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 px-2 text-muted-foreground opacity-50"
        disabled
      >
        <Bookmark className="size-4" />
      </Button>
    </div>
  );
}
