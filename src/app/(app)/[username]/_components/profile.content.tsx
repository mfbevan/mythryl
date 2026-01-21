"use client";

import { api } from "~/trpc/react";
import { ProfileHeader } from "./profile.header";
import { ProfileBio } from "./profile.bio";
import { ProfileStats } from "./profile.stats";
import { ProfileLinkedAccounts } from "./profile.linked-accounts";
import { ProfileSkeleton } from "./profile.skeleton";
import { ProfileNotFound } from "./profile.not-found";

interface ProfileContentProps {
  username: string;
}

export const ProfileContent = ({ username }: ProfileContentProps) => {
  const { data: profile, isLoading, isError } = api.profiles.getByUsername.useQuery(
    { username },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return <ProfileNotFound username={username} />;
  }

  return (
    <div className="flex flex-col">
      <ProfileHeader profile={profile} />
      <ProfileBio profile={profile} />
      <ProfileStats profile={profile} />
      <ProfileLinkedAccounts profile={profile} />
    </div>
  );
};
