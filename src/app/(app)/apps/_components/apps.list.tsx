"use client";

import { PackageIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { useAppsList, useAppsFilters } from "./apps.hooks";
import { AppsCard, AppsCardSkeleton } from "./apps.card";

export const AppsList = () => {
  const { data, isLoading } = useAppsList();
  const { hasFilters } = useAppsFilters();

  if (isLoading) {
    return <AppsListSkeleton />;
  }

  if (!data?.data.length) {
    return <AppsListEmpty hasFilters={hasFilters} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.data.map((app) => (
        <AppsCard key={app.miniapp.url} app={app} />
      ))}
    </div>
  );
};

export const AppsListSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <AppsCardSkeleton key={i} />
    ))}
  </div>
);

const AppsListEmpty = ({ hasFilters }: { hasFilters: boolean }) => (
  <Empty className="mt-8">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PackageIcon />
      </EmptyMedia>
      <EmptyTitle>No apps found</EmptyTitle>
      <EmptyDescription>
        {hasFilters
          ? "Try adjusting your search or filter criteria"
          : "No apps have been indexed yet. Check back soon!"}
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);
