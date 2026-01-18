"use client";

import { useMutation } from "@tanstack/react-query";
import sdk from "@farcaster/miniapp-sdk";
import { useSession, signIn, getCsrfToken } from "next-auth/react";
import { SignInButton, type StatusAPIResponse } from "@farcaster/auth-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { FarcasterIcon } from "./farcaster.icon";

import {
  useFarcasterContext,
  useIsMiniApp,
} from "~/components/farcaster/farcaster.hooks";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";

export const FarcasterSignIn = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const session = useSession();
  const [ctx] = useFarcasterContext();
  const [isMiniApp, miniAppState] = useIsMiniApp();
  const signInButtonRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  const isLoginPage = pathname === "/login";

  const getRedirectUrl = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get("redirectUrl") ?? params.get("callback") ?? undefined;
  }, []);

  useEffect(() => {
    if (isMiniApp) {
      console.log("Auto Sign In");
      void handleFarcasterSignIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiniApp]);

  const handleFarcasterSignIn = useCallback(async () => {
    const isMiniApp = await sdk.isInMiniApp().catch(() => false);
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");

    if (isMiniApp) {
      const auth = await sdk.actions.signIn({
        nonce,
        acceptAuthAddress: true,
      });

      await signIn("farcaster", {
        message: auth.message,
        signature: auth.signature as `0x${string}`,
        username: ctx?.user.username,
        displayName: ctx?.user.displayName,
        avatar: ctx?.user.pfpUrl,
        redirect: isLoginPage,
        callbackUrl: isLoginPage ? getRedirectUrl() : undefined,
      });
    } else {
      const button = signInButtonRef.current?.querySelector("button");
      button?.click();
    }
    setShowDialog(false);
  }, [ctx?.user, isLoginPage, getRedirectUrl]);

  const farcasterSignIn = useMutation({
    mutationFn: handleFarcasterSignIn,
    onSuccess: () => {
      console.log("Sign in successful");
    },
    onError: (e) => {
      console.error("Sign in failed:", e);
    },
  });

  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      void signIn("farcaster", {
        message: res.message,
        signature: res.signature,
        username: res.username,
        displayName: res.displayName,
        avatar: res.pfpUrl,
        redirect: isLoginPage,
        callbackUrl: isLoginPage ? getRedirectUrl() : undefined,
      }).catch(console.error);
    },
    [isLoginPage, getRedirectUrl],
  );

  const handleSignUp = () => {
    window.open("https://farcaster.xyz/~/r/mfbevan.eth", "_blank");
    setShowDialog(false);
  };

  const showMiniAppLoading =
    isMiniApp &&
    (session.status !== "authenticated" || farcasterSignIn.isPending);

  return (
    <>
      <div ref={signInButtonRef} className="hidden">
        <SignInButton
          nonce={getCsrfToken}
          onSuccess={handleSuccess}
          onError={console.error}
        />
      </div>

      {showMiniAppLoading && (
        <div className={cn("dark flex flex-col items-center gap-1", className)}>
          <Spinner className="h-5 w-5" />
          <p className="text-muted-foreground text-xs">Signing in...</p>
        </div>
      )}

      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className={cn(
          className,
          (miniAppState.isLoading ||
            miniAppState.isFetching ||
            isMiniApp ||
            session.status === "loading" ||
            farcasterSignIn.isPending) &&
            "hidden",
        )}
        isLoading={farcasterSignIn.isPending}
      >
        <FarcasterIcon className="text-violet-500" />
        Farcaster
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm md:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FarcasterIcon className="text-violet-500" /> Sign in With
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
              disabled={farcasterSignIn.isPending}
            >
              Sign Up
            </Button>
            <Button
              onClick={() => farcasterSignIn.mutate()}
              isLoading={farcasterSignIn.isPending}
              disabled={farcasterSignIn.isPending}
              className="flex-1 bg-violet-500 hover:bg-violet-600"
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
