"use client";

import { Skeleton } from "~/components/ui/skeleton";

export const CastSkeleton = () => {
  return (
    <div className="flex gap-3 border-b px-4 py-3">
      {/* Avatar */}
      <Skeleton className="size-10 shrink-0 rounded-full" />

      <div className="flex flex-1 flex-col gap-2">
        {/* Author row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Actions row */}
        <div className="mt-2 flex items-center gap-6">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
}
