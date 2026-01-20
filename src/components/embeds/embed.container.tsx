"use client";

import { EmbedImage } from "./embed.image";
import { EmbedVideo } from "./embed.video";
import { EmbedLink } from "./embed.link";
import { EmbedCast } from "./embed.cast";
import type { Embed, EmbedUrl } from "~/server/api/routers/feed/feed.schema";

interface EmbedContainerProps {
  embed: Embed;
}

// Helper to detect embed type
const getEmbedType = (embed: Embed): "image" | "video" | "cast" | "link" => {
  // Check if it's an embedded cast
  if ("cast" in embed && embed.cast) {
    return "cast";
  }

  // Check if it's a URL embed
  if ("url" in embed) {
    const urlEmbed = embed;
    const contentType = urlEmbed.metadata?.content_type ?? "";
    const url = urlEmbed.url.toLowerCase();

    // Check for image types
    if (
      contentType.startsWith("image/") ||
      (/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.exec(url))
    ) {
      return "image";
    }

    // Check for video types
    if (
      contentType.startsWith("video/") ||
      (/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.exec(url)) ||
      urlEmbed.metadata?.video
    ) {
      return "video";
    }

    // Default to link preview
    return "link";
  }

  return "link";
}

export const EmbedContainer = ({ embed }: EmbedContainerProps) => {
  const embedType = getEmbedType(embed);

  switch (embedType) {
    case "image":
      return <EmbedImage embed={embed as EmbedUrl} />;
    case "video":
      return <EmbedVideo embed={embed as EmbedUrl} />;
    case "cast":
      if ("cast" in embed && embed.cast) {
        return <EmbedCast cast={embed.cast} />;
      }
      return null;
    case "link":
      return <EmbedLink embed={embed as EmbedUrl} />;
    default:
      return null;
  }
}
