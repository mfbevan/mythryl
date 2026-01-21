"use client";

import { create } from "zustand";

export type TabConfig<T extends string> = {
  value: T;
  label: string;
};

export const createPageTabsStore = <T extends string>(
  tabs: readonly TabConfig<T>[],
  defaultTab: T,
) => {
  return create<{
    activeTab: T;
    tabs: readonly TabConfig<T>[];
    setActiveTab: (tab: T) => void;
  }>((set) => ({
    activeTab: defaultTab,
    tabs,
    setActiveTab: (tab) => set({ activeTab: tab }),
  }));
};
