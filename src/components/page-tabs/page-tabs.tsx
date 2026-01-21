"use client";

import { useId } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "~/lib/utils";
import type { TabConfig } from "./page-tabs.hooks";

type PageTabsProps<T extends string> = {
  tabs: readonly TabConfig<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
};

export const PageTabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: PageTabsProps<T>) => {
  const id = useId();

  return (
    <LayoutGroup id={id}>
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative rounded px-2 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="indicator"
                  className="bg-foreground absolute inset-0 rounded"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
};
