import type * as Context from "@farcaster/miniapp-core/dist/context";

export interface MiniAppHostOptions {
  user: Context.MiniAppUser;
  onClose: () => void;
  onReady: () => void;
}

export interface MiniAppHostContext {
  context: Context.MiniAppContext;
  walletAddress: string;
}
