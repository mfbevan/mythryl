"use client";

import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Author, Channel } from "~/server/api/routers/feed/feed.schema";

interface CastAuthorProps {
  author: Author;
  timestamp: string;
  channel?: Channel;
}

export const CastAuthor = ({ author, timestamp, channel }: CastAuthorProps) => {
  const timeAgo = formatDistanceToNowStrict(new Date(timestamp), {
    addSuffix: false,
  });

  const shortTime = timeAgo
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" weeks", "w")
    .replace(" week", "w")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y");

  const profileUrl = `/${author.username}`;

  return (
    <div className="flex items-start gap-2">
      <Link href={profileUrl} onClick={(e) => e.stopPropagation()}>
        <Avatar className="size-9 transition-opacity hover:opacity-80">
          <AvatarImage src={author.pfp_url ?? undefined} alt={author.username} />
          <AvatarFallback className="text-xs">
            {author.display_name?.[0] ?? author.username[0]}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col text-sm">
        <div className="flex items-center gap-1.5">
          <Link
            href={profileUrl}
            onClick={(e) => e.stopPropagation()}
            className="truncate font-semibold text-foreground hover:underline"
          >
            {author.display_name ?? author.username}
          </Link>
          {author.power_badge && (
            <svg
              className="size-3.5 shrink-0 text-purple-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{shortTime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Link
            href={profileUrl}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            @{author.username}
          </Link>
          {channel && (
            <>
              <span>·</span>
              <span className="text-primary">/{channel.id}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
