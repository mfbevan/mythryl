"use client";

import { useCallback } from "react";
import { Loader2 } from "lucide-react";

import { useMiniapp } from "../windows.hooks";
import { useWindowActions } from "../provider";
import { MiniAppHost } from "~/components/miniapps";

interface MiniappWindowContentProps {
  url: string;
  windowId: string;
}

export const MiniappWindowContent = ({ url, windowId }: MiniappWindowContentProps) => {
  const { app, isLoading, isError } = useMiniapp(url);
  const { removeWindow } = useWindowActions();

  const handleClose = useCallback(() => {
    removeWindow(windowId);
  }, [removeWindow, windowId]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
        <span className="text-muted-foreground text-sm">Loading app...</span>
      </div>
    );
  }

  // Use MiniAppHost for proper SDK integration
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const appUrl = app?.config.homeUrl ?? fullUrl;

  return (
    <MiniAppHost
      url={appUrl}
      onClose={handleClose}
      splashImageUrl={app?.config.splashImageUrl}
      splashBackgroundColor={app?.config.splashBackgroundColor}
      appName={app?.config.name}
    />
  );
};
