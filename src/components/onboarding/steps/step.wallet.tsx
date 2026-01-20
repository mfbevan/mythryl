"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { inAppWallet } from "thirdweb/wallets";
import { useSetActiveWallet } from "thirdweb/react";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { client } from "~/services/thirdweb.service";

interface StepWalletProps {
  onComplete: () => void;
}

/**
 * TODO: Upgrade Thirdweb plan to use custom auth endpoint strategy for wallet creation.
 * Currently using backend strategy with FID as the wallet secret as a temp solution.
 */
export const StepWallet = ({ onComplete }: StepWalletProps) => {
  const utils = api.useUtils();
  const setActiveWallet = useSetActiveWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setWalletAddress = api.onboarding.setWalletAddress.useMutation({
    onSuccess: () => {
      void utils.onboarding.getStatus.invalidate();
      onComplete();
    },
    onError: (err) => {
      setError(err.message);
      setIsCreating(false);
    },
  });

  const handleCreateWallet = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const wallet = inAppWallet();

      // TODO: Replace with custom auth endpoint strategy when Thirdweb plan upgraded
      // Using guest strategy for testing
      const account = await wallet.connect({
        client,
        strategy: "guest",
      });

      if (!account?.address) {
        throw new Error("Failed to get wallet address");
      }

      // Set as active wallet in Thirdweb context for subsequent steps
      await setActiveWallet(wallet);

      // Save address to server
      await setWalletAddress.mutateAsync({ address: account.address });
    } catch (err) {
      console.error("Wallet creation failed:", err);
      setError(err instanceof Error ? err.message : "Failed to create wallet");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <Wallet className="text-primary h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Create Your Wallet</h2>
        <p className="text-muted-foreground text-sm">
          We&apos;ll create a secure embedded wallet for you. This wallet is
          linked to your Farcaster account and used for signing transactions.
        </p>
      </div>

      <Button
        onClick={handleCreateWallet}
        isLoading={isCreating || setWalletAddress.isPending}
        className="w-full max-w-xs"
      >
        Create Wallet
      </Button>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};
