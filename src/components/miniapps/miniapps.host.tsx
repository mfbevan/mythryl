"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { exposeToIframe } from "@farcaster/miniapp-host";
import type * as Context from "@farcaster/miniapp-core/dist/context";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { createMiniAppHostSDK } from "./miniapps.sdk";
import { createHostEthProvider } from "./miniapps.provider";

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
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleReady = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !session?.user) return;

    // Build mini app context
    const context: Context.MiniAppContext = {
      client: {
        platformType: "web",
        clientFid: 0, // Mythryl's FID - update with actual value
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

    // Create SDK with toast handlers
    const sdk = createMiniAppHostSDK(
      {
        user: {
          fid: session.user.fid,
          username: session.user.name ?? undefined,
          displayName: session.user.name ?? undefined,
          pfpUrl: session.user.image ?? undefined,
        },
        onClose,
        onReady: handleReady,
      },
      context,
    );

    // Create eth provider with user's wallet address
    const ethProvider = createHostEthProvider(session.user.address);

    // Expose SDK to iframe via postMessage
    const { cleanup } = exposeToIframe({
      iframe,
      sdk,
      miniAppOrigin: new URL(url).origin,
      ethProvider: ethProvider as Parameters<typeof exposeToIframe>[0]["ethProvider"],
      debug: true,
    });

    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [session, url, onClose, handleReady]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Splash screen */}
      {showSplash && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300"
          style={{
            backgroundColor: splashBackgroundColor ?? "#000",
          }}
        >
          {splashImageUrl ? (
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
                Loading {appName ?? "app"}...
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
