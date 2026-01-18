import sdk from "@farcaster/miniapp-sdk";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSetActiveWallet } from "thirdweb/react";
import { client, activeChain } from "~/services/thirdweb.service";
import { farcasterWallet } from "./farcaster.wallet";

const isClient = typeof window !== "undefined" && !!sdk;

export const useIsMiniApp = () => {
  const query = useQuery({
    queryKey: ["farcaster-mini-app", isClient],
    queryFn: async () => {
      const isFarcasterMiniApp = await sdk.isInMiniApp();
      const isMiniApp = isFarcasterMiniApp;
      return isMiniApp;
    },
    retryDelay: 3000,
    retry: 5,
  });

  return [query.data ?? false, query] as const;
};

export const useFarcasterContext = () => {
  const [isMiniApp] = useIsMiniApp();

  const query = useQuery({
    queryKey: ["farcaster-ctx", isClient, isMiniApp],
    queryFn: async () => {
      if (!isMiniApp) return null;

      const ctx = await sdk.context;
      return ctx ?? null;
    },
    retry: false,
  });

  return [query.data, query] as const;
};

export const useFarcasterWallet = () => {
  const [hasAutoConnected, setHasAutoConnected] = useState(false);
  const setActiveWallet = useSetActiveWallet();
  const [isInMiniApp] = useIsMiniApp();

  const query = useQuery({
    queryKey: [
      "farcaster-wallet",
      farcasterWallet,
      hasAutoConnected,
      isClient,
      isInMiniApp,
    ],
    queryFn: async () => {
      if (!isInMiniApp || !sdk.wallet.ethProvider || hasAutoConnected)
        return null;

      const account = await farcasterWallet.connect({
        client,
        chain: activeChain,
      });
      void setActiveWallet(farcasterWallet);
      setHasAutoConnected(true);

      return {
        wallet: farcasterWallet,
        account,
      };
    },
  });

  return {
    ...query,
    wallet: query.data?.wallet,
    account: query.data?.account,
  };
};
