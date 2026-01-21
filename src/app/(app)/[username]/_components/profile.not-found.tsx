"use client";

import { UserX } from "lucide-react";

interface ProfileNotFoundProps {
  username: string;
}

export const ProfileNotFound = ({ username }: ProfileNotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <UserX className="text-muted-foreground mb-4 h-16 w-16" />
      <h2 className="text-lg font-semibold">Profile not found</h2>
      <p className="text-muted-foreground mt-1 text-center text-sm">
        The user @{username} doesn&apos;t exist on Farcaster.
      </p>
    </div>
  );
};
