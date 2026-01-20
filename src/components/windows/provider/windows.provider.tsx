"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { useStore } from "zustand";

import { useIsMobile } from "~/hooks/use-mobile";

import { createWindowsStore, type WindowsStore } from "./windows.store";

export type WindowsStoreApi = ReturnType<typeof createWindowsStore>;

export const WindowsStoreContext = createContext<WindowsStoreApi | null>(null);

export const WindowsProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<WindowsStoreApi | null>(null);
  const isMobile = useIsMobile();

  storeRef.current ??= createWindowsStore();

  useEffect(() => {
    storeRef.current?.getState().setIsMobile(isMobile);
  }, [isMobile]);

  return (
    <WindowsStoreContext.Provider value={storeRef.current}>
      {children}
    </WindowsStoreContext.Provider>
  );
};

export const useWindowsStore = <T,>(selector: (state: WindowsStore) => T): T => {
  const store = useContext(WindowsStoreContext);

  if (!store) {
    throw new Error("useWindowsStore must be used within a WindowsProvider");
  }

  return useStore(store, selector);
};

export const useWindowActions = () => {
  const store = useContext(WindowsStoreContext);

  if (!store) {
    throw new Error("useWindowActions must be used within a WindowsProvider");
  }

  return useMemo(
    () => ({
      addWindow: store.getState().addWindow,
      removeWindow: store.getState().removeWindow,
      removeWindowsByType: store.getState().removeWindowsByType,
      openWindow: store.getState().openWindow,
      closeWindow: store.getState().closeWindow,
      toggleWindow: store.getState().toggleWindow,
      toggleWindowByType: store.getState().toggleWindowByType,
      closeOldestOpenWindow: store.getState().closeOldestOpenWindow,
      minimizeAllWindows: store.getState().minimizeAllWindows,
      removeAllWindows: store.getState().removeAllWindows,
      reorderWindows: store.getState().reorderWindows,
      popOutWindow: store.getState().popOutWindow,
      popInWindow: store.getState().popInWindow,
    }),
    [store]
  );
};

export const useWindows = () => {
  return useWindowsStore((state) => state.windows);
};
