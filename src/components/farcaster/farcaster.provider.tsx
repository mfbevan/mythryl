"use client";

import "~/styles/farcaster-auth.css";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { optimism } from "thirdweb/chains";
import { getBaseDomain, getBaseUrl } from "~/services/url.service";
import { useEffect, useMemo, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { useWalletStore } from "../wallet/wallet.store";
import { useFarcasterWallet, useIsMiniApp } from "./farcaster.hooks";
import { useActiveAccount } from "thirdweb/react";
import { useSession } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import { FarcasterSignIn } from "./farcaster.signin";
import { rpc } from "~/services/thirdweb.service";

export const FarcasterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = useSession();
  useFarcasterWallet();

  const [isFrameSetup, setIsFrameSetup] = useState(false);
  const [isMiniApp] = useIsMiniApp();

  useEffect(() => {
    if (!isFrameSetup) {
      setIsFrameSetup(true);
      void sdk.actions.ready({ disableNativeGestures: false });
      void sdk.wallet.ethProvider;
    }
  }, [isFrameSetup]);

  const account = useActiveAccount();
  const { setAddress } = useWalletStore();

  useEffect(() => {
    if (!account?.address) return setAddress(undefined);
    setAddress(account.address);
  }, [account?.address, setAddress]);

  const content = useMemo(() => {
    // Show signing in for Farcaster
    if (
      isMiniApp &&
      (session.status !== "authenticated" || !account?.address)
    ) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
          <Spinner className="text-primary" />
          <span>
            {session.status === "authenticated"
              ? "Connecting Wallet... "
              : "Signing in..."}
          </span>
        </div>
      );
    }

    return children;
  }, [account?.address, children, isMiniApp, session.status]);

  const domain = useMemo(() => {
    // Normalize domain - remove www. prefix to match server-side
    return getBaseDomain().replace(/^www\./, "");
  }, []);

  return (
    <AuthKitProvider
      config={{
        domain,
        siweUri: getBaseUrl(),
        rpcUrl: rpc(optimism),
        relay: "https://relay.farcaster.xyz",
      }}
    >
      <div className="hidden">
        <FarcasterSignIn />
      </div>
      {content}
    </AuthKitProvider>
  );
};
