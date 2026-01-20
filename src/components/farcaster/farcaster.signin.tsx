"use client";

import "~/styles/farcaster-auth.css";

import { useSession, signIn, getCsrfToken } from "next-auth/react";
import { SignInButton, type StatusAPIResponse } from "@farcaster/auth-kit";
import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { FarcasterIcon } from "./farcaster.icon";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export const FarcasterSignIn = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const session = useSession();
  const signInButtonRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const isSignInPage = pathname === "/signin";

  const getRedirectUrl = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get("redirectUrl") ?? params.get("callback") ?? undefined;
  }, []);

  const handleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    // Close our dialog to show the Farcaster auth-kit modal
    setShowDialog(false);
    // Wait for dialog to close before opening auth-kit modal
    await new Promise((resolve) => setTimeout(resolve, 150));
    const button = signInButtonRef.current?.querySelector("button");
    if (button) {
      button.click();
    }
    setIsSigningIn(false);
  }, []);

  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      void signIn("farcaster", {
        message: res.message,
        signature: res.signature,
        username: res.username,
        displayName: res.displayName,
        avatar: res.pfpUrl,
        redirect: isSignInPage,
        callbackUrl: isSignInPage ? getRedirectUrl() : undefined,
      }).catch(console.error);
    },
    [isSignInPage, getRedirectUrl],
  );

  const handleSignUp = () => {
    window.open("https://farcaster.xyz/~/r/mfbevan.eth", "_blank");
    setShowDialog(false);
  };

  return (
    <>
      <div ref={signInButtonRef} className="hidden">
        <SignInButton
          nonce={getCsrfToken}
          onSuccess={handleSuccess}
          onError={console.error}
        />
      </div>

      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className={cn(className)}
        isLoading={session.status === "loading" || isSigningIn}
      >
        <FarcasterIcon />
        Farcaster
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm md:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FarcasterIcon className="text-farcaster-500" /> Sign in With
              Farcaster
            </DialogTitle>
            <DialogDescription>
              Do you already have a Farcaster account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              onClick={handleSignUp}
              variant="secondary"
              className="flex-1"
              disabled={isSigningIn}
            >
              Sign Up
            </Button>
            <Button
              onClick={handleSignIn}
              isLoading={isSigningIn}
              disabled={isSigningIn}
              className="bg-farcaster-500 hover:bg-farcaster-600 flex-1"
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
