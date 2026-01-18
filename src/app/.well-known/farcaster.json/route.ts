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
    baseBuilder: {
      allowedAddresses: ["0xeAbEc05d7c47EFf16c279d9091F4008324c693cC"],
    },
    accountAssociation: {
      header:
        "eyJmaWQiOjM4NTY1MSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGJDZTFmZEQ2QzU3ZDdFRWZiNjMxMTg0NTRiNjEzZjhjMzBhQzQ0QTUifQ",
      payload: "eyJkb21haW4iOiJpbW11dGFnZW4uYWkifQ",
      signature:
        "UV9+c07lZT5HmUvhxGhMzoLxBF5A/TJkB0Vqwvunb4o4WwqcDnM3gEcuJjWsVf0RCmF9++glsYKYIDB9RqGwFhw=",
    },
    frame: {
      version: "next",
      name: defaultTitle,
      subtitle: defaultSubtitle,
      description: defaultDescription,
      homeUrl: createLiveUrl("/home"),
      iconUrl: defaultIconPath,
      imageUrl: defaultEmbedImage,
      heroImageUrl: defaultImagePath,
      buttonTitle: "Immutagen AI",
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
