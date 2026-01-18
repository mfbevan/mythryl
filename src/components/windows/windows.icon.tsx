"use client";

import { useState } from "react";
import { LayoutGrid, Loader2 } from "lucide-react";
import Image from "next/image";

import { cn } from "~/lib/utils";

import { getWindowIcon } from "./windows.config";
import { useMiniapp } from "./windows.hooks";
import type { Window } from "./windows.schema";

interface WindowIconProps {
  window: Window;
  className?: string;
}

export const WindowIcon = ({ window, className }: WindowIconProps) => {
  if (window.type === "miniapp" || window.type === "preview") {
    return <MiniappIcon url={window.url} className={className} />;
  }

  const Icon = getWindowIcon(window);
  return <Icon className={cn("shrink-0", className)} />;
};

interface MiniappIconProps {
  url: string;
  className?: string;
}

const MiniappIcon = ({ url, className }: MiniappIconProps) => {
  const { app, isLoading } = useMiniapp(url);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return <Loader2 className={cn("shrink-0 animate-spin", className)} />;
  }

  if (app?.config.iconUrl && !imageError) {
    return (
      <Image
        src={app.config.iconUrl}
        alt={app.config.name}
        width={20}
        height={20}
        className={cn("object-cover", className)}
        unoptimized
        onError={() => setImageError(true)}
      />
    );
  }

  return <LayoutGrid className={cn("shrink-0", className)} />;
};
