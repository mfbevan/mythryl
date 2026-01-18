import type { Window } from "./windows.schema";

export function getWindowKey(window: Window): string {
  switch (window.type) {
    case "wallet":
      return "wallet";
    case "message":
      return "message";
    case "miniapp":
      return `miniapp-${encodeURIComponent(window.url)}`;
    case "token":
      return `token-${window.chainId}-${window.address}`;
    case "conversation":
      return `conversation-${window.recipientId}`;
  }
}

export function extractHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}
