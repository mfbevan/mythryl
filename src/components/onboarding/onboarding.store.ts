import { create } from "zustand";

interface OnboardingStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
