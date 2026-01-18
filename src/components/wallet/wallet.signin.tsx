"use client";

import { useEffect, useState } from "react";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { Suspense } from "react";
import Frames from "@farcaster/miniapp-sdk";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";

import { farcasterWallet } from "../farcaster/farcaster.wallet";

import { activeChain, client } from "~/services/thirdweb.service";
import { cn } from "~/lib/utils";
import { logoImage } from "~/services/image.service";
import {
  getLoginPayload,
  isLoggedIn,
  logout,
} from "~/server/auth/thirdweb.actions";
import { defaultTitle, defaultDescription } from "~/services/metadata.service";
import { getBaseUrl } from "~/services/url.service";

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

  const { mutateAsync: doLogin } = useMutation({
    mutationFn: async (payload: VerifyLoginPayloadParams) => {
      await signIn("thirdweb", { payload: JSON.stringify(payload) });
    },
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Suspense fallback={<div className="bg-zinc-700" />}>
      <ThirdwebConnectButton
        client={client}
        wallets={[
          createWallet("io.metamask"),
          createWallet("com.coinbase.wallet"),
          createWallet("me.rainbow"),
          createWallet("io.rabby"),
          createWallet("org.uniswap"),
          farcasterWallet,
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
          doLogout: logout,
          getLoginPayload,
        }}
      />
    </Suspense>
  );
};
