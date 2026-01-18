"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Client, IdentifierKind } from "@xmtp/browser-sdk";
import { ReactionCodec } from "@xmtp/content-type-reaction";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { viemAdapter } from "thirdweb/adapters/viem";
import type { WalletClient } from "viem";

import { activeChain, client as thirdwebClient } from "~/services/thirdweb.service";
import type { XmtpClient, XmtpClientStatus } from "./messages.types";

const XMTP_ENV = "dev" as const;

interface MessagesContextValue {
  client: XmtpClient | null;
  status: XmtpClientStatus;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isReady: boolean;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};

export const useMessagesClient = () => {
  const { client, isReady } = useMessages();
  return { client, isReady };
};

const hexToBytes = (hex: string): Uint8Array => {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<XmtpClient | null>(null);
  const [status, setStatus] = useState<XmtpClientStatus>("disconnected");
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<XmtpClient | null>(null);

  const account = useActiveAccount();
  const wallet = useActiveWallet();

  const connect = useCallback(async () => {
    if (!account || !wallet) {
      setError(new Error("No wallet connected"));
      setStatus("error");
      return;
    }

    if (clientRef.current) {
      return;
    }

    setStatus("connecting");
    setError(null);

    try {
      const walletClient = viemAdapter.wallet.toViem({
        wallet,
        client: thirdwebClient,
        chain: activeChain,
      }) as WalletClient;

      const walletAccount = walletClient.account;
      if (!walletAccount) {
        throw new Error("Wallet client has no account");
      }

      const signer = {
        type: "EOA" as const,
        getIdentifier: () => ({
          identifier: walletAccount.address.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        }),
        signMessage: async (message: string) => {
          const signature = await walletClient.signMessage({
            message,
            account: walletAccount,
          });
          return hexToBytes(signature);
        },
      };

      const xmtpClient = await Client.create(signer, {
        env: XMTP_ENV,
        codecs: [new ReactionCodec()],
      });

      clientRef.current = xmtpClient;
      setClient(xmtpClient);
      setStatus("connected");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to connect to XMTP");
      setError(error);
      setStatus("error");
      console.error("XMTP connection error:", err);
    }
  }, [account, wallet]);

  const disconnect = useCallback(() => {
    clientRef.current = null;
    setClient(null);
    setStatus("disconnected");
    setError(null);
  }, []);

  // Auto-disconnect when wallet disconnects
  useEffect(() => {
    if (!account && client) {
      disconnect();
    }
  }, [account, client, disconnect]);

  // Auto-connect when wallet is available and we're not connected
  useEffect(() => {
    if (account && wallet && status === "disconnected") {
      void connect();
    }
  }, [account, wallet, status, connect]);

  const isReady = status === "connected" && client !== null;

  return (
    <MessagesContext.Provider
      value={{
        client,
        status,
        error,
        connect,
        disconnect,
        isReady,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
