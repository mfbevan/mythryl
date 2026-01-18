"use client";

import { FarcasterIcon } from "~/components/farcaster/farcaster.icon";
import { useSocialLink } from "~/components/socials/socials.hooks";
import { Button } from "~/components/ui/button";

export const LoginSocials = () => {
  const { openSocial } = useSocialLink();

  return (
    <div className="fixed top-0 right-0 flex items-center gap-2 p-4">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() =>
          openSocial({
            type: "farcaster-profile",
            username: "mfbevan.eth",
            fid: 3856581,
          })
        }
      >
        <img
          src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/0caa69a5-9a77-4b8f-4db0-770a14261100/original"
          alt="mfbevan.eth"
          className="size-9 rounded-full"
        />
        <div className="bg-background absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full p-1.5">
          <FarcasterIcon className="bg-background size-2.5 text-violet-500" />
        </div>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() =>
          openSocial({
            type: "farcaster-channel",
            channelId: "farverse",
          })
        }
      >
        <img
          src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/4ea72051-1921-45ac-7e11-2bcb7e9c6000/original"
          alt="/farverse"
          className="size-9 rounded-full"
        />
        <div className="bg-background absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full p-1.5">
          <FarcasterIcon className="bg-background size-2.5 text-violet-500" />
        </div>
      </Button>
    </div>
  );
};
