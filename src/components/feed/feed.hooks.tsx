"use client";

import { api } from "~/trpc/react";

import { createPageTabsStore } from "~/components/page-tabs";
import type { FeedType } from "~/server/api/routers/feed/feed.schema";

export const useFeed = (feedType: FeedType) => {
  return api.feed.getFeed.useInfiniteQuery(
    { feedType, limit: 25 },
    {
      getNextPageParam: (lastPage) => lastPage.next?.cursor,
      refetchOnWindowFocus: false,
    },
  );
};

export const useCast = (hash: string) => {
  return api.feed.getCast.useQuery(
    { hash },
    {
      enabled: !!hash,
      refetchOnWindowFocus: false,
    },
  );
};

export const useCastConversation = (hash: string) => {
  return api.feed.getCastConversation.useQuery(
    { hash, replyDepth: 2, includeChronologicalParentCasts: true, limit: 20 },
    {
      enabled: !!hash,
      refetchOnWindowFocus: false,
    },
  );
};

const FEED_TABS = [
  { value: "following", label: "Following" },
  { value: "for_you", label: "For You" },
  { value: "trending", label: "Trending" },
] as const satisfies readonly { value: FeedType; label: string }[];

export const useFeedTabs = createPageTabsStore(FEED_TABS, "following");
