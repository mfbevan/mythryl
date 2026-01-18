"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { FarcasterIcon } from "../farcaster/farcaster.icon";
import { Button } from "../ui/button";
import sdk from "@farcaster/miniapp-sdk";
import { useIsMiniApp } from "../farcaster/farcaster.hooks";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ActionsCast = ({
  embeds,
}: {
  embeds: [] | [string] | [string, string];
}) => {
  const [isMiniApp] = useIsMiniApp();
  const [casted, setCasted] = useState(false);

  const onAction = () => {
    void sdk.actions.composeCast({ embeds });
    setCasted(true);
    setTimeout(() => setCasted(false), 3000);
  };

  if (!isMiniApp) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="iconXs"
          variant="ghost"
          className="relative"
          onClick={onAction}
        >
          {casted ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <>
              <MessageCircle className="size-4" />
              <FarcasterIcon className="absolute inset-0 mx-auto my-auto size-1.5" />
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">Share to Farcaster</TooltipContent>
    </Tooltip>
  );
};
