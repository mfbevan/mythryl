import { createStore } from "zustand/vanilla";

import type { Window, WindowInstance } from "../windows.schema";
import { getWindowKey, normalizeUrl } from "../windows.utils";
import { broadcastWindowState, type PopoutWindowState } from "~/components/tauri";
import { focusPopOutWindow } from "~/lib/tauri";

export interface WindowsStore {
  windows: Map<string, WindowInstance>;
  isMobile: boolean;

  setIsMobile: (isMobile: boolean) => void;
  addWindow: (window: Window) => void;
  removeWindow: (key: string) => void;
  removeWindowsByType: (type: Window["type"]) => void;
  openWindow: (key: string) => void;
  closeWindow: (key: string) => void;
  toggleWindow: (key: string) => void;
  toggleWindowByType: (window: Window) => void;
  closeOldestOpenWindow: () => void;
  minimizeAllWindows: () => void;
  removeAllWindows: () => void;
  reorderWindows: (activeKey: string, overKey: string) => void;
  popOutWindow: (key: string) => void;
  popInWindow: (key: string) => void;
}

export const createWindowsStore = () => {
  return createStore<WindowsStore>((set, get) => ({
    windows: new Map(),
    isMobile: false,

    setIsMobile: (isMobile) => set({ isMobile }),

    addWindow: (window) => {
      // Normalize URLs for miniapp and preview windows
      const normalizedWindow: Window =
        window.type === "miniapp" || window.type === "preview"
          ? { ...window, url: normalizeUrl(window.url) }
          : window;

      const key = getWindowKey(normalizedWindow);
      const { windows, isMobile } = get();

      // For preview windows, replace the URL if one already exists
      if (normalizedWindow.type === "preview" && windows.has(key)) {
        const newWindows = new Map(windows);
        const existing = newWindows.get(key)!;
        newWindows.set(key, {
          ...existing,
          window: normalizedWindow,
          isOpen: true,
        });
        set({ windows: newWindows });
        return;
      }

      if (windows.has(key)) {
        get().openWindow(key);
        return;
      }

      const newWindows = new Map(windows);

      if (isMobile) {
        for (const [k, instance] of newWindows) {
          newWindows.set(k, { ...instance, isOpen: false });
        }
      }

      const maxOrder = Math.max(0, ...Array.from(newWindows.values()).map((w) => w.order));
      newWindows.set(key, {
        key,
        window: normalizedWindow,
        isOpen: true,
        order: maxOrder + 1,
      });

      set({ windows: newWindows });
    },

    removeWindow: (key) => {
      const { windows } = get();
      const newWindows = new Map(windows);
      newWindows.delete(key);
      set({ windows: newWindows });
    },

    removeWindowsByType: (type) => {
      const { windows } = get();
      const newWindows = new Map(windows);
      for (const [key, instance] of newWindows) {
        if (instance.window.type === type) {
          newWindows.delete(key);
        }
      }
      set({ windows: newWindows });
    },

    openWindow: (key) => {
      const { windows, isMobile } = get();
      const instance = windows.get(key);
      if (!instance) return;

      // If window is popped out, focus the pop-out window instead
      if (instance.isPoppedOut) {
        void focusPopOutWindow(key);
        return;
      }

      const newWindows = new Map(windows);

      if (isMobile) {
        for (const [k, inst] of newWindows) {
          newWindows.set(k, { ...inst, isOpen: false });
        }
      }

      newWindows.set(key, { ...instance, isOpen: true });
      set({ windows: newWindows });
    },

    closeWindow: (key) => {
      const { windows } = get();
      const instance = windows.get(key);
      if (!instance) return;

      const newWindows = new Map(windows);
      newWindows.set(key, { ...instance, isOpen: false });
      set({ windows: newWindows });
    },

    toggleWindow: (key) => {
      const { windows } = get();
      const instance = windows.get(key);
      if (!instance) return;

      if (instance.isOpen) {
        get().closeWindow(key);
      } else {
        get().openWindow(key);
      }
    },

    toggleWindowByType: (window) => {
      const key = getWindowKey(window);
      const { windows } = get();
      const instance = windows.get(key);

      if (!instance) {
        get().addWindow(window);
      } else if (instance.isOpen) {
        get().closeWindow(key);
      } else {
        get().openWindow(key);
      }
    },

    closeOldestOpenWindow: () => {
      const { windows } = get();
      const openWindows = Array.from(windows.values())
        .filter((w) => w.isOpen)
        .sort((a, b) => a.order - b.order);

      if (openWindows.length > 0) {
        get().closeWindow(openWindows[0]!.key);
      }
    },

    minimizeAllWindows: () => {
      const { windows } = get();
      const newWindows = new Map(windows);
      for (const [k, instance] of newWindows) {
        newWindows.set(k, { ...instance, isOpen: false });
      }
      set({ windows: newWindows });
    },

    removeAllWindows: () => {
      set({ windows: new Map() });
    },

    reorderWindows: (activeKey, overKey) => {
      const { windows } = get();
      const sortedWindows = Array.from(windows.values()).sort((a, b) => a.order - b.order);

      const activeIndex = sortedWindows.findIndex((w) => w.key === activeKey);
      const overIndex = sortedWindows.findIndex((w) => w.key === overKey);

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

      const [movedWindow] = sortedWindows.splice(activeIndex, 1);
      sortedWindows.splice(overIndex, 0, movedWindow!);

      const newWindows = new Map<string, WindowInstance>();
      sortedWindows.forEach((w, index) => {
        newWindows.set(w.key, { ...w, order: index });
      });

      set({ windows: newWindows });
    },

    popOutWindow: (key) => {
      const { windows } = get();
      const instance = windows.get(key);
      if (!instance) return;

      const newWindows = new Map(windows);
      newWindows.set(key, { ...instance, isPoppedOut: true, isOpen: false });
      set({ windows: newWindows });

      // Broadcast state to pop-out windows
      const poppedOutWindows: PopoutWindowState[] = Array.from(newWindows.values())
        .filter((w) => w.isPoppedOut)
        .map((w) => ({ key: w.key, window: w.window }));
      broadcastWindowState(poppedOutWindows);
    },

    popInWindow: (key) => {
      const { windows } = get();
      const instance = windows.get(key);
      if (!instance) return;

      const newWindows = new Map(windows);
      newWindows.set(key, { ...instance, isPoppedOut: false, isOpen: true });
      set({ windows: newWindows });

      // Broadcast updated state
      const poppedOutWindows: PopoutWindowState[] = Array.from(newWindows.values())
        .filter((w) => w.isPoppedOut)
        .map((w) => ({ key: w.key, window: w.window }));
      broadcastWindowState(poppedOutWindows);
    },
  }));
};
