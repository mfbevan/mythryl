"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { exposeToIframe } from "@farcaster/miniapp-host";
import type * as Context from "@farcaster/miniapp-core/dist/context";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { inAppWallet } from "thirdweb/wallets";
import { useSetActiveWallet } from "thirdweb/react";

import { createMiniAppHostSDK } from "./miniapps.sdk";
import { createHostEthProvider } from "./miniapps.provider";
import {
  useCurrentAccount,
  useCurrentChain,
} from "~/components/wallet/wallet.store";
import { base } from "thirdweb/chains";
import { client } from "~/services/thirdweb.service";

interface MiniAppHostProps {
  url: string;
  onClose: () => void;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
  appName?: string;
}

export const MiniAppHost = ({
  url,
  onClose,
  splashImageUrl,
  splashBackgroundColor,
  appName,
}: MiniAppHostProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data: session } = useSession();
  const [showSplash, setShowSplash] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const initializedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Get wallet from Thirdweb
  const account = useCurrentAccount();
  const chain = useCurrentChain() ?? base;
  const setActiveWallet = useSetActiveWallet();

  // Auto-connect to in-app wallet if not already connected
  useEffect(() => {
    const connectWallet = async () => {
      if (account || isConnecting || !session?.user) return;

      setIsConnecting(true);
      setConnectionError(null);

      try {
        const wallet = inAppWallet();

        // Connect using guest strategy (same as onboarding)
        const connectedAccount = await wallet.connect({
          client,
          strategy: "guest",
        });

        if (!connectedAccount?.address) {
          throw new Error("Failed to connect wallet");
        }

        // Set as active wallet in Thirdweb context
        await setActiveWallet(wallet);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        setConnectionError(
          err instanceof Error ? err.message : "Failed to connect wallet",
        );
      } finally {
        setIsConnecting(false);
      }
    };

    void connectWallet();
  }, [account, isConnecting, session?.user, setActiveWallet]);

  const handleReady = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !session?.user || !account) return;

    // Prevent double initialization (React StrictMode)
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Build mini app context
    const context: Context.MiniAppContext = {
      client: {
        platformType: "web",
        clientFid: 0,
        added: false,
        safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      },
      user: {
        fid: session.user.fid,
        username: session.user.name ?? undefined,
        displayName: session.user.name ?? undefined,
        pfpUrl: session.user.image ?? undefined,
      },
      location: {
        type: "launcher",
      },
      features: {
        haptics: false,
      },
    };

    // Create SDK with handlers
    const sdk = createMiniAppHostSDK(
      {
        user: {
          fid: session.user.fid,
          username: session.user.name ?? undefined,
          displayName: session.user.name ?? undefined,
          pfpUrl: session.user.image ?? undefined,
        },
        onClose: () => onCloseRef.current(),
        onReady: handleReady,
        account,
        chain,
        miniAppUrl: url,
      },
      context,
    );

    // Create eth provider with Thirdweb account
    const ethProvider = createHostEthProvider({
      account,
      chain,
    });

    // Expose SDK to iframe via postMessage
    const { cleanup } = exposeToIframe({
      iframe,
      sdk,
      miniAppOrigin: new URL(url).origin,
      ethProvider: ethProvider as Parameters<
        typeof exposeToIframe
      >[0]["ethProvider"],
      debug: true,
    });

    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [session, url, handleReady, account, chain]);

  const isWalletReady = !!account;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Splash screen */}
      {(showSplash || !isWalletReady) && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300"
          style={{
            backgroundColor: splashBackgroundColor ?? "#000",
          }}
        >
          {connectionError ? (
            <div className="flex flex-col items-center gap-4 p-4 text-center">
              <span className="text-sm text-red-400">{connectionError}</span>
              <button
                onClick={() => {
                  setConnectionError(null);
                  setIsConnecting(false);
                }}
                className="text-sm text-white/70 underline hover:text-white"
              >
                Retry
              </button>
            </div>
          ) : splashImageUrl ? (
            <Image
              src={splashImageUrl}
              alt={appName ?? "Mini App"}
              width={128}
              height={128}
              className="rounded-xs object-contain"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
              <span className="text-muted-foreground text-sm">
                {isConnecting
                  ? "Connecting wallet..."
                  : !isWalletReady
                    ? "Preparing wallet..."
                    : `Loading ${appName ?? "app"}...`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mini app iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        className="absolute inset-0 z-10 h-full w-full border-0"
        allow="clipboard-write; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};
