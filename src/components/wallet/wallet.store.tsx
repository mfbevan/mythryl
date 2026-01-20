import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { create } from "zustand";

export interface WalletStore {
  address?: string;
  setAddress: (address?: string) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: undefined,
  setAddress: (address) => set({ address }),
}));

export const useCurrentWallet = () => {
  return useActiveWallet();
};

export const useCurrentAccount = () => {
  return useActiveAccount();
};

export const useCurrentChain = () => {
  return useActiveWalletChain();
};

export const useSwitchChain = () => {
  return useSwitchActiveWalletChain();
};
