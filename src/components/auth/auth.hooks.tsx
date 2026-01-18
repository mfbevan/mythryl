"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";
import { useWalletStore } from "../wallet/wallet.store";

export const useIsAuthenticated = () => {
  const session = useSession();

  return session.status === "authenticated" && !!session.data.user.id;
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      return toast
        .promise(
          async () => {
            return await signOut({
              callbackUrl: "/login",
            });
          },
          {
            loading: "Signing out...",
            success: "Signed out",
            error: "Failed to sign out",
          },
        )
        .unwrap();
    },
  });
};

export const useCanTransact = () => {
  const isAuthenticated = useIsAuthenticated();
  const account = useActiveAccount();
  const { address } = useWalletStore();

  return isAuthenticated && !!account?.address && !!address;
};

export const useIsSessionLoading = () => {
  const session = useSession();
  return session.status === "loading";
};
