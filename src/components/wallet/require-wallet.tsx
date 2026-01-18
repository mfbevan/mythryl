"use client";

import { useActiveAccount } from "thirdweb/react";
import { AlertCircle } from "lucide-react";
import { ConnectButton } from "./connect-button";

interface RequireWalletProps {
  children: React.ReactNode;
  message?: string;
}

export const RequireWallet = ({
  children,
  message = "Please connect your wallet to continue",
}: RequireWalletProps) => {
  const account = useActiveAccount();

  if (!account?.address) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-muted/50 rounded-full p-4">
          <AlertCircle className="text-muted-foreground size-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Wallet Required</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  return <>{children}</>;
};
