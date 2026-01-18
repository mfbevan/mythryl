"use client";

import { Globe, Landmark, X } from "lucide-react";

import { useSocialLink } from "~/components/socials/socials.hooks";
import { cn } from "~/lib/utils";
import { FarcasterIcon } from "../farcaster/farcaster.icon";
import Telegram from "../ui/svgs/telegram";
import { useTheme } from "next-themes";
import type { Social } from "~/server/api/schema/socials.validator";
import { Button } from "../ui/button";
import { GithubDark } from "../ui/svgs/githubDark";
import { GithubLight } from "../ui/svgs/githubLight";
import { XDark } from "../ui/svgs/xDark";

export const SocialList = ({ socials }: { socials: Social[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {socials.map((social) => (
        <SocialIcon key={social.type} social={social} />
      ))}
    </div>
  );
};

const SocialIcon = ({ social }: { social: Social }) => {
  const theme = useTheme();
  const isLight = theme.theme === "light";

  switch (social.type) {
    case "website":
      return (
        <IconButton social={social}>
          <Globe className="size-3" />
        </IconButton>
      );
    case "twitter":
      return (
        <IconButton social={social}>
          {isLight ? <X className="size-3" /> : <XDark className="size-3" />}
        </IconButton>
      );
    case "farcaster-profile":
      return (
        <IconButton social={social}>
          <FarcasterIcon className="size-3" />
        </IconButton>
      );
    case "farcaster-channel":
      return (
        <IconButton social={social}>
          <FarcasterIcon className="size-3" />
        </IconButton>
      );
    case "telegram":
      return (
        <IconButton social={social}>
          <Telegram className="size-3" />
        </IconButton>
      );
    case "empire":
      return (
        <IconButton social={social}>
          <Landmark className="size-3" />
        </IconButton>
      );
    case "github":
      return (
        <IconButton social={social}>
          {isLight ? (
            <GithubLight className="size-3" />
          ) : (
            <GithubDark className="size-3" />
          )}
        </IconButton>
      );
  }
};

const IconButton = ({
  children,
  social,
  className,
}: {
  children: React.ReactNode;
  social?: Social;
  className?: string;
}) => {
  const { openSocial } = useSocialLink();

  return (
    <Button
      size="iconXs"
      className={cn("rounded-full", className)}
      onClick={() => social && openSocial(social)}
    >
      {children}
    </Button>
  );
};
