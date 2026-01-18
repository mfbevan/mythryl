"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { createNftStore, type NftStore } from "./nft.store";

export type NftStoreApi = ReturnType<typeof createNftStore>;

export const NftStoreContext = createContext<NftStoreApi | null>(null);

export const NftProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: Partial<NftStore>;
}) => {
  const storeRef = useRef<NftStoreApi | null>(null);

  storeRef.current ??= createNftStore(initialState);

  return (
    <NftStoreContext.Provider value={storeRef.current}>
      {children}
    </NftStoreContext.Provider>
  );
};

export const useNftStore = () => {
  const existingStore = useContext(NftStoreContext);

  if (!existingStore) {
    throw new Error("useNftStore must be used within an NftProvider");
  }

  return useStore(existingStore, (s) => s);
};
