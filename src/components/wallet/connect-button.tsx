"use client";

import { useEffect, useState } from "react";
import type { ConnectButtonProps } from "thirdweb/react";
import {
  darkTheme,
  lightTheme,
  ConnectButton as ThirdwebConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useWalletDetailsModal,
  useWalletImage,
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useTheme } from "next-themes";
import { farcasterWallet } from "../farcaster/farcaster.wallet";

import { activeChain, client } from "~/services/thirdweb.service";
import { api } from "~/trpc/react";
import { defaultDescription, defaultTitle } from "~/services/metadata.service";
import { cn } from "~/lib/utils";
import { logoImage } from "~/services/image.service";
import { getBaseUrl } from "~/services/url.service";

const baseClassName = cn("!w-full !h-10 !text-sm");

export const useConnectButton = ({
  className,
}: { className?: string } = {}) => {
  const utils = api.useUtils();
  const modal = useWalletDetailsModal();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const walletImage = useWalletImage(wallet?.id);
  const disconnect = useDisconnect();
  const isConnected = account?.address;
  const theme = useTheme();

  const onDisconnect = async () => {
    try {
      disconnect.disconnect(wallet!);
      await utils.invalidate();
      // router.push("/");
    } catch (error) {
      console.error("Error during manual logout:", error);
      // Still clear local state and disconnect wallet even if logout fails
      disconnect.disconnect(wallet!);
      await utils.invalidate();
      // router.push("/");
    }
  };

  const connectOptions = {
    client,
    wallets: [
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
      createWallet("io.rabby"),
      createWallet("org.uniswap"),
      farcasterWallet,
    ],
    chain: activeChain,
    theme:
      theme.theme === "dark"
        ? darkTheme({
            colors: {
              accentText: "var(--color-rose-500)",
              accentButtonText: "var(--color-rose-50)",
              accentButtonBg: "var(--color-rose-500)",
            },
          })
        : lightTheme({
            colors: {
              accentText: "var(--color-rose-500)",
              accentButtonText: "var(--color-rose-50)",
              accentButtonBg: "var(--color-rose-500)",
            },
          }),
    autoConnect: true,
    connectModal: {
      privacyPolicyUrl: "/privacy",
      termsOfServiceUrl: "/terms",
      size: "compact",
      showThirdwebBranding: false,
    },
    onDisconnect: () => {
      void onDisconnect();
    },
    connectButton: {
      className: cn(
        baseClassName,
        "!bg-primary !uppercase !text-white",
        className,
      ),
      label: "Connect Wallet",
    },
    detailsButton: {
      className: cn(baseClassName, className),
    },
    signInButton: {
      className: cn(baseClassName, className),
    },
    switchButton: {
      className: cn(baseClassName, className),
      label: `Switch to ${activeChain.name}`,
    },
    appMetadata: {
      name: defaultTitle,
      description: defaultDescription,
      url: getBaseUrl(),
      logoUrl: logoImage(),
    },
  } satisfies ConnectButtonProps;

  return {
    connectOptions,
    walletImage,
    wallet,
    account,
    isConnected,
    onDisconnect,
    modal,
  };
};

export const ConnectButton = ({ className }: { className?: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  const { connectOptions } = useConnectButton({ className });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ThirdwebConnectButton {...connectOptions} />;
};
