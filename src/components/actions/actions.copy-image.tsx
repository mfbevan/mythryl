"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ActionsCopyImage = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const onAction = async () => {
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy image:", error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="iconXs"
          variant="ghost"
          className="relative"
          onClick={onAction}
        >
          {copied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">Copy Image</TooltipContent>
    </Tooltip>
  );
};
