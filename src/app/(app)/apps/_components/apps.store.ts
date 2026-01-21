import { create } from "zustand";

type AppsFilterState = {
  // Input state (what user is typing)
  searchInput: string;
  // Submitted state (what triggers the query)
  search: string;
  category: string | null;
};

type AppsFilterActions = {
  setSearchInput: (value: string) => void;
  submitSearch: () => void;
  setCategory: (category: string | null) => void;
  clearFilters: () => void;
};

export type AppsStore = AppsFilterState & AppsFilterActions;

export const useAppsStore = create<AppsStore>((set, get) => ({
  // State
  searchInput: "",
  search: "",
  category: null,

  // Actions
  setSearchInput: (value) => set({ searchInput: value }),

  submitSearch: () => set({ search: get().searchInput }),

  setCategory: (category) => set({ category }),

  clearFilters: () =>
    set({
      searchInput: "",
      search: "",
      category: null,
    }),
}));
