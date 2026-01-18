"use client";

import type { Window } from "./windows.schema";
import { WalletWindowContent } from "./content/windows.wallet";
import { MessageWindowContent } from "./content/windows.message";
import { MiniappWindowContent } from "./content/windows.miniapp";
import { TokenWindowContent } from "./content/windows.token";
import { ConversationWindowContent } from "./content/windows.conversation";

interface WindowContentProps {
  window: Window;
}

export function WindowContent({ window }: WindowContentProps) {
  switch (window.type) {
    case "wallet":
      return <WalletWindowContent />;
    case "message":
      return <MessageWindowContent />;
    case "miniapp":
    case "preview":
      return <MiniappWindowContent url={window.url} />;
    case "token":
      return <TokenWindowContent chainId={window.chainId} address={window.address} />;
    case "conversation":
      return <ConversationWindowContent recipientId={window.recipientId} recipientName={window.recipientName} />;
  }
}
