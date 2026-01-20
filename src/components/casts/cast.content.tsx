"use client";

import { useMemo } from "react";
import type { Author } from "~/server/api/routers/feed/feed.schema";

interface CastContentProps {
  text: string;
  mentionedProfiles?: Author[];
}

// Regex to match mentions and URLs
const MENTION_REGEX = /@(\w+)/g;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const CastContent = ({ text, mentionedProfiles }: CastContentProps) => {
  const parsedContent = useMemo(() => {
    const mentionMap = new Map(
      mentionedProfiles?.map((profile) => [profile.username.toLowerCase(), profile]) ?? []
    );

    // Split text by URLs first, then process mentions
    const parts: Array<{ type: "text" | "mention" | "link"; content: string; profile?: Author }> = [];
    let lastIndex = 0;

    // Find all URLs
    const urlMatches: Array<{ index: number; length: number; url: string }> = [];
    let urlMatch;
    while ((urlMatch = URL_REGEX.exec(text)) !== null) {
      urlMatches.push({
        index: urlMatch.index,
        length: urlMatch[0].length,
        url: urlMatch[0],
      });
    }

    // Process text, extracting URLs
    for (const match of urlMatches) {
      // Add text before URL
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        // Process mentions in this text segment
        processTextWithMentions(textBefore, mentionMap, parts);
      }

      // Add URL
      parts.push({ type: "link", content: match.url });
      lastIndex = match.index + match.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      processTextWithMentions(remainingText, mentionMap, parts);
    }

    return parts;
  }, [text, mentionedProfiles]);

  return (
    <p className="whitespace-pre-wrap break-words text-foreground">
      {parsedContent.map((part, i) => {
        if (part.type === "mention") {
          return (
            <span key={i} className="text-primary hover:underline cursor-pointer">
              @{part.content}
            </span>
          );
        }
        if (part.type === "link") {
          // Clean up display URL
          const displayUrl = part.content
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "");
          return (
            <a
              key={i}
              href={part.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {displayUrl.length > 30 ? `${displayUrl.slice(0, 30)}...` : displayUrl}
            </a>
          );
        }
        return <span key={i}>{part.content}</span>;
      })}
    </p>
  );
}

const processTextWithMentions = (
  text: string,
  mentionMap: Map<string, Author>,
  parts: Array<{ type: "text" | "mention" | "link"; content: string; profile?: Author }>
) => {
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex
  MENTION_REGEX.lastIndex = 0;

  while ((match = MENTION_REGEX.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    const username = match[1]!.toLowerCase();
    const profile = mentionMap.get(username);

    parts.push({
      type: "mention",
      content: match[1]!,
      profile,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }
}
