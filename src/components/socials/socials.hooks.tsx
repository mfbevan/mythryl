"use client";

import sdk from "@farcaster/miniapp-sdk";

import { useIsMiniApp } from "../farcaster/farcaster.hooks";

import type { Social } from "~/server/api/schema/socials.validator";

export const useSocialLink = () => {
  const [isMiniApp] = useIsMiniApp();

  const openSocial = (social: Social) => {
    switch (social.type) {
      case "website":
        if (isMiniApp) {
          void sdk.actions.openUrl({ url: social.url });
          break;
        }
        window.open(social.url, "_blank");
        break;
      case "miniapp":
      case "empire":
        if (isMiniApp) {
          void sdk.actions.openMiniApp({ url: social.url });
          break;
        }
        window.open(social.url, "_blank");
        break;
      case "twitter":
        window.open(`https://x.com/${social.username}`, "_blank");
        break;
      case "farcaster-profile":
        if (isMiniApp) {
          void sdk.actions.viewProfile({ fid: social.fid });
          break;
        }
        window.open(`https://farcaster.xyz/${social.username}`, "_blank");
        break;
      case "farcaster-channel":
        if (isMiniApp) {
          void sdk.actions.openUrl({
            url: `https://farcaster.xyz/~/channel/${social.channelId}`,
          });
          break;
        }
        window.open(
          `https://farcaster.xyz/~/channel/${social.channelId}`,
          "_blank",
        );
        break;
      case "github":
        window.open(`https://github.com/${social.username}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/${social.username}`, "_blank");
        break;
    }
  };

  return { openSocial };
};
