"use client";

import { ExternalLink } from "lucide-react";
import type { EmbedUrl } from "~/server/api/routers/feed/feed.schema";

interface EmbedLinkProps {
  embed: EmbedUrl;
}

export const EmbedLink = ({ embed }: EmbedLinkProps) => {
  const html = embed.metadata?.html;
  const ogImage = html?.ogImage?.[0]?.url;
  const title = html?.ogTitle;
  const description = html?.ogDescription;

  let domain = "";
  try {
    domain = new URL(embed.url).hostname.replace("www.", "");
  } catch {
    domain = embed.url;
  }

  return (
    <a
      href={embed.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-72 shrink-0 overflow-hidden rounded-lg border transition-colors hover:bg-muted/50"
      onClick={(e) => e.stopPropagation()}
    >
      {ogImage && (
        <div className="aspect-[2/1] w-full overflow-hidden">
          <img
            src={ogImage}
            alt={title ?? ""}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-1 p-3">
        {title && (
          <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {title}
          </p>
        )}
        {description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {description}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ExternalLink className="size-3" />
          <span>{domain}</span>
        </div>
      </div>
    </a>
  );
}
