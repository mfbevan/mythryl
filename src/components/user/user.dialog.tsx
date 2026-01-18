"use client";

import { create } from "zustand";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { useCurrentUser, useUser } from "./user.hooks";

interface UserDialogStore {
  userId: string | null;
  isOpen: boolean;
  openDialog: (userId: string) => void;
  closeDialog: () => void;
}

export const useUserDialogStore = create<UserDialogStore>((set) => ({
  userId: null,
  isOpen: false,
  openDialog: (userId) => set({ userId, isOpen: true }),
  closeDialog: () => set({ isOpen: false, userId: null }),
}));

const UserDialogSkeleton = () => {
  return (
    <div className="flex flex-col">
      {/* Blurred background section skeleton */}
      <div className="relative h-32 overflow-hidden">
        <Skeleton className="absolute inset-0" />
      </div>

      {/* Content section with overlapping avatar skeleton */}
      <div className="relative -mt-12 flex flex-col items-center gap-4 px-6 pb-6">
        <Skeleton className="border-background size-24 rounded-full border-4" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export const UserDialog = () => {
  const { userId, isOpen, closeDialog } = useUserDialogStore();
  const [currentUser] = useCurrentUser();
  const [fetchedUser] = useUser(userId);

  const user = userId && currentUser?.id === userId ? currentUser : fetchedUser;

  return (
    <Dialog
      open={isOpen && !!userId}
      onOpenChange={(open) => !open && closeDialog()}
    >
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <DialogTitle className="sr-only">
          {user?.displayName ?? "User Profile"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          View user information including avatar, display name, and username.
        </DialogDescription>

        {user ? (
          <div className="flex flex-col">
            {/* Blurred background section */}
            <div className="relative h-32 overflow-hidden">
              <div
                className="absolute inset-0 scale-110 bg-cover bg-center blur-3xl"
                style={{
                  backgroundImage: `url(${user.avatar})`,
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content section with overlapping avatar */}
            <div className="relative -mt-12 flex flex-col items-center gap-4 px-6 pb-6">
              <Avatar className="border-background size-24 border-4">
                <AvatarImage src={user.avatar ?? ""} alt={user.id} />
                <AvatarFallback>
                  {user?.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl font-semibold">{user.displayName}</h3>
                <p className="text-muted-foreground text-sm">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <UserDialogSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
};
