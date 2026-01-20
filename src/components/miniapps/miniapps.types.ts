import type * as Context from "@farcaster/miniapp-core/dist/context";
import type { Account } from "thirdweb/wallets";
import type { Chain } from "thirdweb/chains";

export interface MiniAppHostOptions {
  user: Context.MiniAppUser;
  onClose: () => void;
  onReady: () => void;
  account: Account;
  chain: Chain;
  miniAppUrl: string;
}

export interface MiniAppHostContext {
  context: Context.MiniAppContext;
  walletAddress: string;
}
