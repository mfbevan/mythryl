import { AppWindow, Coins, MessageSquare, User, Wallet, type LucideIcon } from "lucide-react";

import type { Window } from "./windows.schema";
import { extractHostname } from "./windows.utils";

interface WindowConfig {
  label: string;
  icon: LucideIcon;
  getLabel?: (window: Window) => string;
}

export const windowConfigs: Record<Window["type"], WindowConfig> = {
  wallet: {
    label: "Wallet",
    icon: Wallet,
  },
  message: {
    label: "Messages",
    icon: MessageSquare,
  },
  miniapp: {
    label: "App",
    icon: AppWindow,
    getLabel: (window) => {
      if (window.type === "miniapp") {
        return extractHostname(window.url);
      }
      return "App";
    },
  },
  token: {
    label: "Token",
    icon: Coins,
  },
  conversation: {
    label: "Chat",
    icon: User,
    getLabel: (window) => {
      if (window.type === "conversation") {
        return window.recipientName;
      }
      return "Chat";
    },
  },
};

export function getWindowLabel(window: Window): string {
  const config = windowConfigs[window.type];
  return config.getLabel?.(window) ?? config.label;
}

export function getWindowIcon(window: Window): LucideIcon {
  return windowConfigs[window.type].icon;
}
