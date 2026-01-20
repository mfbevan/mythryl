"use client";

import { ScreenShare } from "lucide-react";

import { isTauri, createPopOutWindow } from "~/lib/tauri";
import type { Window, WindowInstance } from "~/components/windows/windows.schema";
import { useWindowActions } from "~/components/windows/provider";
import { useMiniapp } from "~/components/windows/windows.hooks";

interface TauriPopoutProps {
  instance: WindowInstance;
}

function getPopoutTitle(window: Window, miniappName?: string): string {
  switch (window.type) {
    case "wallet":
      return "Wallet";
    case "message":
      return "Messages";
    case "miniapp":
    case "preview": {
      if (miniappName) return miniappName;
      try {
        const url = window.url.startsWith("http") ? window.url : `https://${window.url}`;
        return new URL(url).hostname;
      } catch {
        return window.type === "preview" ? "Preview" : "App";
      }
    }
    case "token":
      return `Token: ${window.address.slice(0, 6)}...${window.address.slice(-4)}`;
    case "conversation":
      return `Chat: ${window.recipientName}`;
  }
}

export function TauriPopout({ instance }: TauriPopoutProps) {
  const { popOutWindow } = useWindowActions();

  // Fetch miniapp data if this is a miniapp/preview window
  const isMiniappWindow =
    instance.window.type === "miniapp" || instance.window.type === "preview";
  const miniappUrl = isMiniappWindow ? instance.window.url : "";
  const { app } = useMiniapp(miniappUrl, { enabled: isMiniappWindow });

  if (!isTauri()) return null;

  const handlePopOut = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const title = getPopoutTitle(instance.window, app?.config.name);
    const success = await createPopOutWindow({
      windowKey: instance.key,
      title,
    });

    if (success) {
      popOutWindow(instance.key);
    }
  };

  return (
    <button
      onClick={handlePopOut}
      className="hover:bg-muted-foreground/20 shrink-0 rounded p-0.5 transition-colors"
      title="Pop out to new window"
    >
      <ScreenShare className="size-3.5" />
    </button>
  );
}
