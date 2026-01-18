import { create } from "zustand";

export interface WalletStore {
  address?: string;
  setAddress: (address?: string) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: undefined,
  setAddress: (address) => set({ address }),
}));
