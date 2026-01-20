import type { PhysicalSize, LogicalSize } from "@tauri-apps/api/dpi";

/**
 * Check if the app is running inside Tauri
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  return "__TAURI_INTERNALS__" in window;
}

/**
 * Check if the app is running in Tauri development mode
 */
export function isTauriDev(): boolean {
  if (!isTauri()) return false;
  return process.env.NODE_ENV === "development";
}

// Mobile mode dimensions (iPhone 14 Pro)
const MOBILE_WIDTH = 393;
const MOBILE_HEIGHT = 852;

// Desktop mode dimensions
const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 800;
const DESKTOP_MIN_WIDTH = 800;
const DESKTOP_MIN_HEIGHT = 600;

/**
 * Set the window to mobile mode with fixed iPhone 14 Pro dimensions
 */
export async function setMobileMode(): Promise<void> {
  if (!isTauri()) return;

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const win = getCurrentWindow();

  await win.setResizable(false);
  await win.setSize({ type: "Logical", width: MOBILE_WIDTH, height: MOBILE_HEIGHT } as LogicalSize);
  await win.setMinSize(null);
  await win.setMaxSize(null);
}

/**
 * Set the window to desktop mode with free resize capability
 */
export async function setDesktopMode(): Promise<void> {
  if (!isTauri()) return;

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const win = getCurrentWindow();

  await win.setMinSize({ type: "Logical", width: DESKTOP_MIN_WIDTH, height: DESKTOP_MIN_HEIGHT } as LogicalSize);
  await win.setMaxSize(null);
  await win.setResizable(true);
  await win.setSize({ type: "Logical", width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT } as LogicalSize);
}

/**
 * Get the current window size
 */
export async function getWindowSize(): Promise<PhysicalSize | null> {
  if (!isTauri()) return null;

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const win = getCurrentWindow();
  return win.innerSize();
}

/**
 * Close the current window
 */
export async function closeCurrentWindow(): Promise<void> {
  if (!isTauri()) return;

  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  const win = getCurrentWindow();
  await win.close();
}

// Pop-out window dimensions
const POPOUT_WIDTH = 400;
const POPOUT_HEIGHT = 720;

/**
 * Create a safe Tauri window label from a window key
 * Tauri labels must be alphanumeric with dashes/underscores only
 */
function createSafeLabel(windowKey: string): string {
  // Replace any non-alphanumeric characters (except dash) with underscore
  return `popout-${windowKey.replace(/[^a-zA-Z0-9-]/g, "_")}`;
}

interface CreatePopOutWindowOptions {
  windowKey: string;
  title: string;
  width?: number;
  height?: number;
  onClose?: () => void;
}

/**
 * Create a pop-out window for a specific window key
 */
export async function createPopOutWindow({
  windowKey,
  title,
  width = POPOUT_WIDTH,
  height = POPOUT_HEIGHT,
  onClose,
}: CreatePopOutWindowOptions): Promise<boolean> {
  if (!isTauri()) return false;

  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  const { getAllWebviewWindows } = await import("@tauri-apps/api/webviewWindow");

  const popoutLabel = createSafeLabel(windowKey);

  // Check if window already exists
  const existingWindows = await getAllWebviewWindows();
  const existing = existingWindows.find((w) => w.label === popoutLabel);
  if (existing) {
    await existing.setFocus();
    return true;
  }

  // Create new window
  const url = `/window/${encodeURIComponent(windowKey)}`;
  const webview = new WebviewWindow(popoutLabel, {
    url,
    title,
    width,
    height,
    center: true,
    resizable: true,
    minWidth: 320,
    minHeight: 480,
    // macOS: Transparent title bar gives native rounded corners without traffic lights
    titleBarStyle: "transparent",
    hiddenTitle: true,
  });

  // Wait for window to be created
  return new Promise((resolve) => {
    void webview.once("tauri://created", () => {
      // Listen for window close/destroy
      if (onClose) {
        void webview.once("tauri://destroyed", () => {
          onClose();
        });
      }
      resolve(true);
    });
    void webview.once("tauri://error", () => {
      resolve(false);
    });
  });
}

/**
 * Close a pop-out window by its key
 */
export async function closePopOutWindow(windowKey: string): Promise<void> {
  if (!isTauri()) return;

  const { getAllWebviewWindows } = await import("@tauri-apps/api/webviewWindow");
  const popoutLabel = createSafeLabel(windowKey);

  const existingWindows = await getAllWebviewWindows();
  const existing = existingWindows.find((w) => w.label === popoutLabel);
  if (existing) {
    await existing.close();
  }
}

/**
 * Check if a pop-out window exists for a key
 */
export async function hasPopOutWindow(windowKey: string): Promise<boolean> {
  if (!isTauri()) return false;

  const { getAllWebviewWindows } = await import("@tauri-apps/api/webviewWindow");
  const popoutLabel = createSafeLabel(windowKey);

  const existingWindows = await getAllWebviewWindows();
  return existingWindows.some((w) => w.label === popoutLabel);
}

/**
 * Focus an existing pop-out window
 */
export async function focusPopOutWindow(windowKey: string): Promise<boolean> {
  if (!isTauri()) return false;

  const { getAllWebviewWindows } = await import("@tauri-apps/api/webviewWindow");
  const popoutLabel = createSafeLabel(windowKey);

  const existingWindows = await getAllWebviewWindows();
  const existing = existingWindows.find((w) => w.label === popoutLabel);
  if (existing) {
    await existing.setFocus();
    return true;
  }
  return false;
}

/**
 * Listen for pop-out window close events
 */
export async function onPopOutWindowClose(
  windowKey: string,
  callback: () => void
): Promise<() => void> {
  if (!isTauri()) return () => {};

  const { getAllWebviewWindows } = await import("@tauri-apps/api/webviewWindow");
  const popoutLabel = createSafeLabel(windowKey);

  const existingWindows = await getAllWebviewWindows();
  const existing = existingWindows.find((w) => w.label === popoutLabel);
  if (!existing) return () => {};

  const unlisten = await existing.onCloseRequested(() => {
    callback();
  });

  return unlisten;
}
