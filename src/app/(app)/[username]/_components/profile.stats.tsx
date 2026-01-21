"use client";

import type { CachedFarcasterProfile } from "~/services/neynar.service";

interface ProfileStatsProps {
  profile: CachedFarcasterProfile;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  return (
    <div className="flex gap-4 px-4 pb-4">
      <div className="flex items-center gap-1">
        <span className="font-semibold">
          {formatNumber(profile.following_count)}
        </span>
        <span className="text-muted-foreground text-sm">Following</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-semibold">
          {formatNumber(profile.follower_count)}
        </span>
        <span className="text-muted-foreground text-sm">Followers</span>
      </div>
    </div>
  );
};
