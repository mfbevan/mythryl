"use client";

import { Badge } from "~/components/ui/badge";
import type { CachedFarcasterProfile } from "~/services/neynar.service";

interface ProfileHeaderProps {
  profile: CachedFarcasterProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const bannerUrl = profile.profile?.banner?.url;
  const fallbackBanner = `https://api.dicebear.com/9.x/shapes/svg?seed=${profile.fid}`;

  return (
    <div className="relative">
      {/* Banner */}
      <div className="bg-muted h-32 w-full overflow-hidden">
        <img
          src={bannerUrl ?? fallbackBanner}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Avatar and name section */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="-mt-12 mb-3">
          <img
            src={
              profile.pfp_url ??
              `https://api.dicebear.com/9.x/glass/svg?seed=${profile.fid}`
            }
            alt={profile.display_name ?? profile.username}
            className="border-background h-24 w-24 rounded-full border-4 object-cover"
          />
        </div>

        {/* Display name, username, and pro badge */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold">
            {profile.display_name ?? profile.username}
          </h1>
          {profile.pro && (
            <Badge variant="secondary" className="text-xs">
              Pro
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">@{profile.username}</p>
      </div>
    </div>
  );
};
