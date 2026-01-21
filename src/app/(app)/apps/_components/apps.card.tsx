"use client";

import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import type { Miniapp, UserMiniapp } from "~/server/db/schema";

export type AppsCardProps = {
  app: { miniapp: Miniapp; userMiniapp: UserMiniapp | null };
};

export const AppsCard = ({ app }: AppsCardProps) => {
  const { miniapp, userMiniapp } = app;
  const { config } = miniapp.manifest;

  return (
    <Link
      href={`/apps/${encodeURIComponent(miniapp.url)}`}
      className="hover:bg-accent/50 group flex items-start gap-3 rounded-lg border p-4 transition-colors"
    >
      <Avatar className="size-12 shrink-0 rounded-lg">
        <AvatarImage src={config.iconUrl} alt={config.name} />
        <AvatarFallback className="rounded-lg">
          {config.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{config.name}</p>
          {userMiniapp && (
            <Badge variant="secondary" className="shrink-0 gap-1">
              <CheckIcon className="size-3" />
              Added
            </Badge>
          )}
        </div>

        {config.subtitle && (
          <p className="text-muted-foreground mt-0.5 truncate text-sm">
            {config.subtitle}
          </p>
        )}

        {miniapp.category && (
          <Badge variant="outline" className="mt-2">
            {miniapp.category}
          </Badge>
        )}
      </div>
    </Link>
  );
};

export const AppsCardSkeleton = () => (
  <div className="flex items-start gap-3 rounded-lg border p-4">
    <div className="bg-accent size-12 shrink-0 animate-pulse rounded-lg" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="bg-accent h-5 w-32 animate-pulse rounded" />
      <div className="bg-accent h-4 w-48 animate-pulse rounded" />
      <div className="bg-accent h-5 w-20 animate-pulse rounded-full" />
    </div>
  </div>
);
