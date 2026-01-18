import { EIP1193 } from "thirdweb/wallets";
import { sdk } from "@farcaster/miniapp-sdk";

export const farcasterWallet = EIP1193.fromProvider({
  provider: sdk.wallet.ethProvider,
});

export const createFarcasterWallet = () => {
  const wallet = EIP1193.fromProvider({
    provider: sdk.wallet.ethProvider,
  });

  wallet.getConfig = () => {
    return {
      metadata: {
        name: "Farcaster",
        icon: "https://farcaster.xyz/favicon.ico",
      },
    };
  };

  return wallet;
};
