"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Cast } from "~/server/api/routers/feed/feed.schema";

interface EmbedCastProps {
  cast: Cast;
}

export const EmbedCast = ({ cast }: EmbedCastProps) => {
  const timeAgo = formatDistanceToNowStrict(new Date(cast.timestamp), {
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

  return (
    <Link
      href={`/cast/${cast.hash}`}
      className="block w-72 shrink-0 rounded-lg border p-3 transition-colors hover:bg-muted/50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-5">
          <AvatarImage
            src={cast.author.pfp_url ?? undefined}
            alt={cast.author.username}
          />
          <AvatarFallback className="text-xs">
            {cast.author.display_name?.[0] ?? cast.author.username[0]}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm font-semibold">
          {cast.author.display_name ?? cast.author.username}
        </span>
        <span className="text-sm text-muted-foreground">
          @{cast.author.username}
        </span>
        <span className="text-sm text-muted-foreground">·</span>
        <span className="text-sm text-muted-foreground">{shortTime}</span>
      </div>

      <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-foreground">
        {cast.text}
      </p>
    </Link>
  );
}
