"use client";

import Link from "next/link";

import { Card, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { AppCategory } from "./apps.categories";
import { useAppsStore } from "./apps.store";
import { useAppsTabs } from "./apps.hooks";

type CategoryCardProps = {
  category: AppCategory;
  className?: string;
};

export const CategoryCard = ({ category, className }: CategoryCardProps) => {
  const Icon = category.icon;
  const setCategory = useAppsStore((state) => state.setCategory);
  const { setActiveTab } = useAppsTabs();

  const handleClick = () => {
    setCategory(category.key);
    setActiveTab("discover");
  };

  return (
    <Link href="/apps" onClick={handleClick}>
      <Card
        className={cn(
          "group relative flex aspect-3/2 h-full w-full cursor-pointer items-end justify-between overflow-hidden border-0 p-4",
          className,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-linear-to-br opacity-90",
            category.gradient,
          )}
        />

        <Icon className="absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 opacity-10 transition-transform duration-300 group-hover:scale-110 md:size-40" />

        <CardTitle className="z-2 text-lg text-white">
          {category.name}
        </CardTitle>

        <Icon className="z-2 size-5 text-white/80" />
      </Card>
    </Link>
  );
};
