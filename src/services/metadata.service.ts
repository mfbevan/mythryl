import type { PrimaryCategory } from "@farcaster/miniapp-sdk";
import type { Metadata } from "next";

import { logoImage } from "~/services/image.service";
import { createLiveUrl, createAssetUrl } from "~/services/url.service";

export const defaultUrl = createLiveUrl("/");
export const defaultTitle = "Immutagen";
export const defaultDescription = "Gen AI with Social DNA";
export const defaultSubtitle = "Gen AI with Social DNA";
export const defaultImagePath = createAssetUrl("/embeds/preview.png");
export const defaultEmbedImage = createAssetUrl("/embeds/embed_primary.png");
export const defaultIconPath = logoImage("256");
export const defaultSplashImage = logoImage("transparent");
export const defaultImageAlt = "Immutagen";
export const defaultCanonicalUrl = "immutagen.ai";
export const defaultTags = ["nft", "ai", "generative", "art", "clanker"];
export const defaultTwitterCreator = "@0xmfbevan";
export const defaultPublisher = "Immutagen";
export const defaultApplicationName = "Immutagen";
export const defaultColor = "#09090b";
export const primaryCategory: PrimaryCategory = "art-creativity";

export const createMetadata = (config: {
  title?: string;
  description?: string;
  imagePath?: string;
  imageAlt?: string;
  canonicalUrl?: string;
  keywords?: string[];
  twitterCreator?: string;
  twitterCreatorId?: string;
  publisher?: string;
  applicationName?: string;
}): Metadata => {
  const {
    title = defaultTitle,
    description = defaultDescription,
    imagePath = defaultImagePath,
    imageAlt = defaultImageAlt,
    canonicalUrl = defaultCanonicalUrl,
    keywords = defaultTags,
    twitterCreator = defaultTwitterCreator,
    publisher = defaultPublisher,
    applicationName = defaultApplicationName,
  } = config;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
    description: description || defaultDescription,
    keywords: keywords,
    authors: [{ name: publisher, url: canonicalUrl }],
    creator: publisher,
    publisher: publisher,
    applicationName: applicationName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url: canonicalUrl,
      siteName: applicationName,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/jpeg",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || defaultTitle,
      description: description || defaultDescription,
      creator: twitterCreator,
      images: [
        {
          url: imagePath,
          alt: imageAlt,
        },
      ],
      site: twitterCreator,
    },
    appleWebApp: {
      capable: true,
      title: applicationName,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: defaultEmbedImage,
        button: {
          title: defaultTitle,
          action: {
            type: "launch_frame",
            name: defaultTitle,
            url: createLiveUrl("/home"),
            splashImageUrl: defaultSplashImage,
            splashBackgroundColor: defaultColor,
          },
        },
      }),
      ...other,
    },
  };
};

export const other = {
  "base:app_id": "69422342d77c069a945bdf89",
};
