"use client";

import { useShallow } from "zustand/react/shallow";

import { api } from "~/trpc/react";
import { useAppsStore } from "./apps.store";
import { createPageTabsStore } from "~/components/page-tabs";

export type AppsTabValue = "discover" | "my_apps" | "favorites";

const APPS_TABS = [
  { value: "discover", label: "Discover" },
  { value: "my_apps", label: "My Apps" },
  { value: "favorites", label: "Favorites" },
] as const satisfies readonly { value: AppsTabValue; label: string }[];

export const useAppsTabs = createPageTabsStore(APPS_TABS, "discover");

const ITEMS_PER_PAGE = 24;

/**
 * Hook for apps filter state and actions.
 */
export const useAppsFilters = () => {
  return useAppsStore(
    useShallow((state) => ({
      searchInput: state.searchInput,
      search: state.search,
      category: state.category,
      setSearchInput: state.setSearchInput,
      submitSearch: state.submitSearch,
      setCategory: state.setCategory,
      clearFilters: state.clearFilters,
      hasFilters: !!state.search || !!state.category,
    })),
  );
};

/**
 * Hook for fetching apps list based on current filters.
 */
export const useAppsList = () => {
  const { search, category } = useAppsStore(
    useShallow((state) => ({
      search: state.search,
      category: state.category,
    })),
  );

  return api.apps.listApps.useQuery(
    {
      search: search || undefined,
      category: category ?? undefined,
      limit: ITEMS_PER_PAGE,
      cursor: 0,
    },
    {
      refetchOnWindowFocus: false,
    },
  );
};
