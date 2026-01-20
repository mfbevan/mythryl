"use client";

import { api } from "~/trpc/react";
import type { FeedType } from "~/server/api/routers/feed/feed.schema";

export const useFeed = (feedType: FeedType) => {
  return api.feed.getFeed.useInfiniteQuery(
    { feedType, limit: 25 },
    {
      getNextPageParam: (lastPage) => lastPage.next?.cursor,
      refetchOnWindowFocus: false,
    }
  );
}

export const useCast = (hash: string) => {
  return api.feed.getCast.useQuery(
    { hash },
    {
      enabled: !!hash,
      refetchOnWindowFocus: false,
    }
  );
}

export const useCastConversation = (hash: string) => {
  return api.feed.getCastConversation.useQuery(
    { hash, replyDepth: 2, includeChronologicalParentCasts: true, limit: 20 },
    {
      enabled: !!hash,
      refetchOnWindowFocus: false,
    }
  );
}
