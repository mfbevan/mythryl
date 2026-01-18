import { createStore } from "zustand/vanilla";

import type { Nft } from "~/server/db/schema";

export interface NftStore {
  chainId?: number | null;
  address?: string | null;
  tokenId?: bigint | null;
  nft?: Nft | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpen: (nft: Nft) => void;
  onClose: () => void;
}

export const createNftStore = (initialState: Partial<NftStore>) => {
  return createStore<NftStore>((set) => ({
    ...initialState,
    isOpen: false,
    nft: null,
    setIsOpen: (isOpen) => set({ isOpen }),
    onOpen: (nft) =>
      set({
        chainId: nft.chainId,
        address: nft.address,
        tokenId: nft.tokenId,
        nft,
        isOpen: true,
      }),
    onClose: () =>
      set({
        isOpen: false,
        chainId: null,
        address: null,
        tokenId: null,
        nft: null,
      }),
  }));
};
