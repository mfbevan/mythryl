"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";
import { cn } from "~/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  iconClassName?: string;
}

export const CopyButton = ({
  text,
  className,
  iconClassName,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Button
      variant="ghost"
      size="iconXs"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <Check className={cn("text-green-500", iconClassName)} />
      ) : (
        <Copy className={cn("text-muted-foreground", iconClassName)} />
      )}
    </Button>
  );
};
