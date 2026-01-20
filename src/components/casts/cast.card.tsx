"use client";

import { useRouter } from "next/navigation";
import { CastAuthor } from "./cast.author";
import { CastContent } from "./cast.content";
import { CastActions } from "./cast.actions";
import { EmbedContainer } from "~/components/embeds";
import type { Cast, FeedType } from "~/server/api/routers/feed/feed.schema";

interface CastCardProps {
  cast: Cast;
  feedType?: FeedType;
  isDetail?: boolean;
}

export const CastCard = ({ cast, feedType, isDetail = false }: CastCardProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("video")
    ) {
      return;
    }
    router.push(`/cast/${cast.hash}`);
  };

  const content = (
    <div className="flex flex-col gap-2 px-4 py-3">
      <CastAuthor
        author={cast.author}
        timestamp={cast.timestamp}
        channel={cast.channel}
      />

      <CastContent text={cast.text} mentionedProfiles={cast.mentioned_profiles} />

      {cast.embeds && cast.embeds.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {cast.embeds.map((embed, i) => (
            <EmbedContainer key={i} embed={embed} />
          ))}
        </div>
      )}

      <CastActions
        hash={cast.hash}
        reactions={cast.reactions}
        replies={cast.replies}
        viewerContext={cast.viewer_context}
        feedType={feedType}
      />
    </div>
  );

  if (isDetail) {
    return <div className="border-b">{content}</div>;
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border-b transition-colors hover:bg-muted/50"
    >
      {content}
    </div>
  );
}
