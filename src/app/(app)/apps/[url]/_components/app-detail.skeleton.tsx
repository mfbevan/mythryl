import { Skeleton } from "~/components/ui/skeleton";

export const AppDetailSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex items-start gap-4">
      <Skeleton className="size-16 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <Skeleton className="aspect-video w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);
