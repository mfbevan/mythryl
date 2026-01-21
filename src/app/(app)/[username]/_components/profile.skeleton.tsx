"use client";

import { Skeleton } from "~/components/ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col">
      {/* Banner skeleton */}
      <Skeleton className="h-32 w-full" />

      {/* Avatar and info */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="-mt-12 mb-3">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
        </div>

        {/* Name and username */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Bio */}
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Linked accounts */}
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
