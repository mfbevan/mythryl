import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { viemAdapter } from "thirdweb/adapters/viem";
import type { WalletClient } from "viem";

import { activeChain, client } from "~/services/thirdweb.service";

export const useWalletClient = (): WalletClient | null => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  if (!account) return null;
  if (!wallet) return null;

  const viemWallet = viemAdapter.wallet.toViem({
    wallet,
    client,
    chain: activeChain,
  });

  return viemWallet as WalletClient;
};
