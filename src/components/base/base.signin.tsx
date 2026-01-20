"use client";

import "@farcaster/auth-kit/styles.css";

import { useMutation } from "@tanstack/react-query";
import { useSession, signIn } from "next-auth/react";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { BaseIcon } from "./base.icon";
import { createBaseWallet } from "./base.wallet";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const BaseSignIn = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const session = useSession();

  const isSignInPage = pathname === "/signin";

  const getRedirectUrl = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get("redirectUrl") ?? params.get("callback") ?? undefined;
  }, []);

  const baseSignIn = useMutation({
    mutationFn: async () => {
      const { address, message, signature } = await toast
        .promise(() => createBaseWallet({ signIn: true }), {
          loading: "Connecting Wallet...",
          error: "Failed to connect",
        })
        .unwrap();

      await signIn("base", {
        address,
        message,
        signature,
        redirect: isSignInPage,
        callbackUrl: isSignInPage ? getRedirectUrl() : undefined,
      });
    },
    onSuccess: () => {
      console.log("Sign in successful");
    },
    onError: (e) => {
      console.error("Sign in failed:", e);
    },
  });

  return (
    <Button
      variant="outline"
      className={cn(className)}
      isLoading={session.status === "loading" || baseSignIn.isPending}
      onClick={() => baseSignIn.mutate()}
    >
      <BaseIcon />
      Sign in with Base
    </Button>
  );
};
