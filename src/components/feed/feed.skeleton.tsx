"use client";

import { CastSkeleton } from "~/components/casts";

interface FeedSkeletonProps {
  count?: number;
}

export const FeedSkeleton = ({ count = 5 }: FeedSkeletonProps) => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <CastSkeleton key={i} />
      ))}
    </div>
  );
}
