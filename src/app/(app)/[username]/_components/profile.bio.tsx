"use client";

import type { CachedFarcasterProfile } from "~/services/neynar.service";

interface ProfileBioProps {
  profile: CachedFarcasterProfile;
}

export const ProfileBio = ({ profile }: ProfileBioProps) => {
  const bio = profile.profile?.bio?.text;

  if (!bio) return null;

  return (
    <div className="px-4 pb-4">
      <p className="text-sm whitespace-pre-wrap">{bio}</p>
    </div>
  );
};
