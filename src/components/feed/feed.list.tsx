"use client";

import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { CastCard } from "~/components/casts";
import { FeedSkeleton } from "./feed.skeleton";
import type { FeedType, Cast } from "~/server/api/routers/feed/feed.schema";
import { useFeed } from "./feed.hooks";

interface FeedListProps {
  feedType: FeedType;
}

export const FeedList = ({ feedType }: FeedListProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useFeed(feedType);

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>Failed to load feed</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  const casts = data?.pages.flatMap((page) => page.casts) ?? [];

  if (casts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>No casts found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {casts.map((cast: Cast) => (
        <CastCard key={cast.hash} cast={cast} feedType={feedType} />
      ))}

      {/* Load more trigger */}
      <div ref={loadMoreRef as React.Ref<HTMLDivElement>} className="h-1" />

      {isFetchingNextPage && <FeedSkeleton count={3} />}

      {!hasNextPage && casts.length > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          You&apos;ve reached the end
        </div>
      )}
    </div>
  );
}
