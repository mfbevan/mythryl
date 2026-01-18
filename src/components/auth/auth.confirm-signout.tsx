"use client";

import { LogOut } from "lucide-react";

import { useSignOut } from "./auth.hooks";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface ConfirmSignoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmSignout = ({ open, onOpenChange }: ConfirmSignoutProps) => {
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut.mutate();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs md:max-w-xs">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={signOut.isPending}
            className="flex-1"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
