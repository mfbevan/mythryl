import type { Window } from "~/components/windows/windows.schema";

const SYNC_MESSAGE_KEY = "mythryl-window-sync-message";
const WINDOW_STATE_KEY = "mythryl-popout-windows";

export interface PopoutWindowState {
  key: string;
  window: Window;
}

export type WindowSyncMessage =
  | { type: "WINDOW_STATE_UPDATE"; windows: PopoutWindowState[] }
  | { type: "POPOUT_CLOSED"; key: string }
  | { type: "POPOUT_POPIN"; key: string }
  | { type: "REQUEST_SYNC" };

type StorageMessage = WindowSyncMessage & {
  _id: number; // Unique ID to ensure storage event fires
};

/**
 * Send a message via localStorage (triggers storage event in other windows)
 */
function sendStorageMessage(message: WindowSyncMessage): void {
  const storageMessage: StorageMessage = {
    ...message,
    _id: Date.now() + Math.random(),
  };
  localStorage.setItem(SYNC_MESSAGE_KEY, JSON.stringify(storageMessage));
  // Immediately remove to allow sending the same message type again
  setTimeout(() => localStorage.removeItem(SYNC_MESSAGE_KEY), 50);
}

/**
 * Broadcast window state updates to all pop-out windows
 */
export function broadcastWindowState(windows: PopoutWindowState[]): void {
  if (typeof window === "undefined") return;

  // Store in localStorage for new windows to read on init
  localStorage.setItem(WINDOW_STATE_KEY, JSON.stringify(windows));

  // Send message to other windows via storage event
  sendStorageMessage({ type: "WINDOW_STATE_UPDATE", windows });
}

/**
 * Broadcast that a pop-out window has been closed (should be removed)
 */
export function broadcastPopoutClosed(key: string): void {
  if (typeof window === "undefined") return;
  sendStorageMessage({ type: "POPOUT_CLOSED", key });
}

/**
 * Broadcast that a pop-out window wants to pop back into the main window
 */
export function broadcastPopoutPopIn(key: string): void {
  if (typeof window === "undefined") return;
  sendStorageMessage({ type: "POPOUT_POPIN", key });
}

/**
 * Request a sync from the main window
 */
export function requestWindowSync(): void {
  if (typeof window === "undefined") return;

  sendStorageMessage({ type: "REQUEST_SYNC" });
}

/**
 * Subscribe to window sync messages via storage events
 * Note: storage events only fire in other windows, not the one that made the change
 */
export function subscribeToWindowSync(
  callback: (message: WindowSyncMessage) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: StorageEvent) => {
    if (event.key !== SYNC_MESSAGE_KEY || !event.newValue) return;

    try {
      const storageMessage = JSON.parse(event.newValue) as StorageMessage;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...message } = storageMessage;
      callback(message as WindowSyncMessage);
    } catch {
      // Ignore parse errors
    }
  };

  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("storage", handler);
  };
}

/**
 * Get window data by key from localStorage
 */
export function getWindowByKey(key: string): PopoutWindowState | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(WINDOW_STATE_KEY);
  if (!stored) return null;

  try {
    const windows = JSON.parse(stored) as PopoutWindowState[];
    return windows.find((w) => w.key === key) ?? null;
  } catch {
    return null;
  }
}

/**
 * Get all popped out windows from localStorage
 */
export function getAllPopoutWindows(): PopoutWindowState[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(WINDOW_STATE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as PopoutWindowState[];
  } catch {
    return [];
  }
}
