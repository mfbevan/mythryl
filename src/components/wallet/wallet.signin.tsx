"use client";

import { useEffect, useState } from "react";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { Suspense } from "react";
import Frames from "@farcaster/miniapp-sdk";
import { signIn } from "next-auth/react";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";

import { farcasterWallet } from "../farcaster/farcaster.wallet";

import { activeChain, client } from "~/services/thirdweb.service";
import { cn } from "~/lib/utils";
import { logoImage } from "~/services/image.service";
import { defaultTitle, defaultDescription } from "~/services/metadata.service";
import { getBaseUrl } from "~/services/url.service";
import { api } from "~/trpc/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supportFarcasterWallet = () => {
  try {
    const provider = Frames.wallet.ethProvider;
    return !!provider;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const baseClassName = cn();

export const WalletSignIn = ({ className }: { className?: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const utils = api.useUtils();
  const getLoginPayloadMutation = api.thirdweb.getLoginPayload.useMutation();
  const logoutMutation = api.thirdweb.logout.useMutation();

  const getLoginPayload = async (args: {
    address: string;
    chainId?: number;
  }) => {
    return getLoginPayloadMutation.mutateAsync(args);
  };

  const isLoggedIn = async (address: string) => {
    const result = await utils.thirdweb.isLoggedIn.fetch({ address });
    return result;
  };

  const doLogin = async (payload: VerifyLoginPayloadParams) => {
    await signIn("thirdweb", { payload: JSON.stringify(payload) });
  };

  const doLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Suspense fallback={<div className="bg-zinc-700" />}>
      <ThirdwebConnectButton
        client={client}
        wallets={[
          inAppWallet({
            auth: {
              options: ["farcaster"],
            },
          }),
        ]}
        chain={activeChain}
        autoConnect
        connectModal={{
          privacyPolicyUrl: "/privacy",
          termsOfServiceUrl: "/terms",
          size: "compact",
          showThirdwebBranding: false,
        }}
        connectButton={{
          className: cn(baseClassName, className),
          label: "Connect Wallet",
        }}
        signInButton={{ className: cn(baseClassName, className) }}
        switchButton={{ className: cn(baseClassName, className) }}
        appMetadata={{
          name: defaultTitle,
          description: defaultDescription,
          url: getBaseUrl(),
          logoUrl: logoImage(),
        }}
        detailsModal={{
          hideDisconnect: true,
          hideSwitchWallet: true,
          hideBuyFunds: true,
          hideSendFunds: true,
          hideReceiveFunds: true,
          assetTabs: [],
          manageWallet: {},
        }}
        auth={{
          isLoggedIn,
          doLogin,
          doLogout,
          getLoginPayload,
        }}
      />
    </Suspense>
  );
};
