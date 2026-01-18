import { createStore } from "zustand/vanilla";

import type { Window, WindowInstance } from "../windows.schema";
import { getWindowKey } from "../windows.utils";

export interface WindowsStore {
  windows: Map<string, WindowInstance>;
  isMobile: boolean;

  setIsMobile: (isMobile: boolean) => void;
  addWindow: (window: Window) => void;
  removeWindow: (key: string) => void;
  openWindow: (key: string) => void;
  closeWindow: (key: string) => void;
  toggleWindow: (key: string) => void;
  closeOldestOpenWindow: () => void;
  minimizeAllWindows: () => void;
  removeAllWindows: () => void;
  reorderWindows: (activeKey: string, overKey: string) => void;
}

export const createWindowsStore = () => {
  return createStore<WindowsStore>((set, get) => ({
    windows: new Map(),
    isMobile: false,

    setIsMobile: (isMobile) => set({ isMobile }),

    addWindow: (window) => {
      const key = getWindowKey(window);
      const { windows, isMobile } = get();

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
        window,
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

    openWindow: (key) => {
      const { windows, isMobile } = get();
      const instance = windows.get(key);
      if (!instance) return;

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
  }));
};
