"use client";

import { useState } from "react";
import { FeedList } from "./feed.list";
import { cn } from "~/lib/utils";
import type { FeedType } from "~/server/api/routers/feed/feed.schema";

const FEED_TYPES: { value: FeedType; label: string }[] = [
  { value: "following", label: "Following" },
  { value: "for_you", label: "For You" },
  { value: "trending", label: "Trending" },
];

export const FeedContainer = () => {
  const [activeTab, setActiveTab] = useState<FeedType>("following");

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Fixed header */}
      <div className="shrink-0 border-b bg-background">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-12 items-center">
            <h1 className="text-lg font-semibold">Home</h1>
          </div>
          <div className="flex gap-2 pb-2">
            {FEED_TYPES.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "rounded px-4 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl">
          {activeTab === "following" && <FeedList feedType="following" />}
          {activeTab === "for_you" && <FeedList feedType="for_you" />}
          {activeTab === "trending" && <FeedList feedType="trending" />}
        </div>
      </div>
    </div>
  );
}
