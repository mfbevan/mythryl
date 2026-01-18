"use client";

import { useNft } from "./nft.hooks";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export const NftActions = () => {
  const [nft] = useNft();
  if (!nft) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className={cn(
          "flex-1 border-emerald-500 bg-emerald-500/10 text-emerald-500 dark:border-emerald-500 dark:bg-emerald-500/10",
        )}
      >
        Buy
      </Button>
      <Button
        variant="outline"
        className={cn(
          "flex-1 border-red-500 bg-red-500/10 text-red-500 dark:border-red-500 dark:bg-red-500/10",
        )}
      >
        Sell
      </Button>
      <Button
        variant="outline"
        className={cn(
          "flex-1 border-purple-500 bg-purple-500/10 text-purple-500 dark:border-purple-500 dark:bg-purple-500/10",
        )}
      >
        Send
      </Button>
    </div>
  );
};
