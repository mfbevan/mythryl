import { createBaseAccountSDK } from "@base-org/account";
import type { Address } from "thirdweb";
import { EIP1193 } from "thirdweb/wallets";
import type { Hex } from "viem";

import { defaultIconPath, defaultTitle } from "~/services/metadata.service";

let _baseSdk: ReturnType<typeof createBaseAccountSDK>;

export const createBaseSdk = () => {
  if (_baseSdk) return _baseSdk;

  _baseSdk = createBaseAccountSDK({
    appName: defaultTitle,
    appLogoUrl: defaultIconPath,
  });

  return _baseSdk;
};

export const createBaseWallet = async (
  { signIn }: { signIn?: boolean } = { signIn: false },
) => {
  const sdk = createBaseSdk();
  const provider = sdk.getProvider();
  const wallet = EIP1193.fromProvider({ provider });

  // If not signing in, check if already connected to prevent reconnection dialog
  if (!signIn) {
    try {
      const accounts = (await provider.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts?.length > 0) return { wallet };
    } catch (error) {
      console.log("Not yet connected to Base wallet");
    }
  }

  const clientNonce =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const response = await provider.request({
    method: "wallet_connect",
    params: signIn
      ? [
          {
            version: "1",
            capabilities: {
              signInWithEthereum: {
                nonce: clientNonce,
                chainId: "0x2105", // Base Mainnet - 8453
              },
            },
          },
        ]
      : undefined,
  });

  if (!signIn) return { wallet };

  const [account] = (response as any).accounts ?? [];
  if (!account) throw new Error("No accounts found");
  const address = account.address as Address;
  const { message, signature } = account.capabilities.signInWithEthereum as {
    message: string;
    signature: Hex;
  };

  if (!address) throw new Error("No address found");
  if (!message) throw new Error("No message found");
  if (!signature) throw new Error("No signature found");

  return { wallet, address, message, signature };
};
