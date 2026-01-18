import {
  defaultTitle,
  defaultDescription,
  defaultSubtitle,
  defaultColor,
  defaultEmbedImage,
  defaultIconPath,
  defaultImagePath,
  primaryCategory,
  defaultTags,
  defaultCanonicalUrl,
} from "~/services/metadata.service";
import { getEmojiGif } from "~/services/emoji.service";
import { createLiveUrl } from "~/services/url.service";

export async function GET() {
  return Response.json({
    baseBuilder: {},
    accountAssociation: {},
    frame: {
      version: "next",
      name: defaultTitle,
      subtitle: defaultSubtitle,
      description: defaultDescription,
      homeUrl: createLiveUrl("/home"),
      iconUrl: defaultIconPath,
      imageUrl: defaultEmbedImage,
      heroImageUrl: defaultImagePath,
      buttonTitle: "Mythryl",
      tagline: defaultSubtitle,
      splashImageUrl: getEmojiGif("✨"),
      splashBackgroundColor: defaultColor,
      webhookUrl: createLiveUrl(`/api/webhook`),
      primaryCategory,
      tags: defaultTags,
      ogTitle: defaultTitle,
      ogDescription: defaultDescription,
      ogImageUrl: defaultImagePath,
      canonicalDomain: defaultCanonicalUrl,
    },
  });
}
