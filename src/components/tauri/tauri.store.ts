import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { isTauri, setDesktopMode, setMobileMode } from "~/lib/tauri";

export type ViewMode = "desktop" | "mobile";

interface TauriStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

export const useTauriStore = create<TauriStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        viewMode: "desktop",
        setViewMode: (mode) => set({ viewMode: mode }),
        toggleViewMode: () => {
          const currentMode = get().viewMode;
          set({ viewMode: currentMode === "desktop" ? "mobile" : "desktop" });
        },
      }),
      {
        name: "mythryl-tauri-prefs",
      }
    )
  )
);

// Subscribe to view mode changes and apply them
if (typeof window !== "undefined") {
  useTauriStore.subscribe(
    (state) => state.viewMode,
    (viewMode) => {
      if (!isTauri()) return;
      if (viewMode === "mobile") {
        void setMobileMode();
      } else {
        void setDesktopMode();
      }
    }
  );
}
