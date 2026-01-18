"use client";

import { useEffect, useState } from "react";
import type { ConnectButtonProps } from "thirdweb/react";
import {
  AccountAddress,
  AccountAvatar,
  AccountProvider,
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
import { shortenAddress } from "thirdweb/utils";
import { Moon, Sun, User, Wallet } from "lucide-react";
import { Suspense } from "react";
import Frames from "@farcaster/miniapp-sdk";
import { useTheme } from "next-themes";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChainIcon } from "../chains/chain-icon";
import { useFarcasterContext } from "../farcaster/farcaster.hooks";
import { farcasterWallet } from "../farcaster/farcaster.wallet";

import { Button } from "~/components/ui/button";
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
  const [ctx] = useFarcasterContext();
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  const { connectOptions, walletImage, wallet, account, isConnected, modal } =
    useConnectButton({ className });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ThirdwebConnectButton {...connectOptions} />;

  if (!isConnected) {
    return (
      <Suspense fallback={<div className="bg-zinc-700" />}>
        <div className={cn("flex w-full items-center justify-center")}>
          <ThirdwebConnectButton {...connectOptions} />
        </div>
      </Suspense>
    );
  }

  const FallbackWalletImage = () => (
    <img
      src={walletImage?.data}
      alt={wallet?.id ?? "Wallet Image"}
      className="size-6"
    />
  );

  return (
    <AccountProvider address={account!.address} client={client}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative aspect-square rounded p-0", className)}
          >
            <span className="flex">
              {ctx?.user?.pfpUrl ? (
                <img
                  src={ctx?.user.pfpUrl}
                  alt={ctx?.user.username}
                  className="aspect-square size-full rounded"
                />
              ) : (
                <AccountAvatar
                  className="aspect-square size-full rounded"
                  fallbackComponent={<FallbackWalletImage />}
                  loadingComponent={<FallbackWalletImage />}
                />
              )}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => modal.open(connectOptions)}>
            <div className="flex w-full items-center gap-2">
              <div className="flex items-center gap-2">
                <AccountAvatar
                  className="aspect-square size-5"
                  fallbackComponent={<FallbackWalletImage />}
                  loadingComponent={<FallbackWalletImage />}
                />
                <AccountAddress formatFn={(s) => shortenAddress(s)} />
              </div>

              <p className="text-muted-foreground text-xs">on</p>

              <div className="flex items-center gap-2">
                <ChainIcon chain={activeChain} className="size-4" />
                <p className="line-clamp-1 text-xs font-medium">
                  {activeChain.name}
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/profile/${account?.address}`}>
              <User className="icon-inner-shadow size-4" /> Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => modal.open(connectOptions)}>
            <Wallet className="icon-inner-shadow size-4" /> Wallet
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </DropdownMenuItem>

          {/* <SyncProfile />

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onDisconnect}>
            <LogOut className="icon-inner-shadow size-4" /> Disconnect
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </AccountProvider>
  );
};
