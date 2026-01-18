import type { Window } from "./windows.schema";

export function normalizeUrl(url: string): string {
  try {
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(withProtocol);
    // Strip protocol, lowercase hostname, remove trailing slash
    const path = parsed.pathname.replace(/\/$/, "");
    return `${parsed.hostname.toLowerCase()}${path}${parsed.search}`;
  } catch {
    return url.toLowerCase();
  }
}

export function getWindowKey(window: Window): string {
  switch (window.type) {
    case "wallet":
      return "wallet";
    case "message":
      return "message";
    case "miniapp":
      return `miniapp-${normalizeUrl(window.url)}`;
    case "preview":
      return "preview"; // Fixed key ensures only one preview window
    case "token":
      return `token-${window.chainId}-${window.address}`;
    case "conversation":
      return `conversation-${window.recipientId}`;
  }
}

export function extractHostname(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname;
  } catch {
    return url;
  }
}
