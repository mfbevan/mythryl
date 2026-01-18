"use client";

import { useNft } from "./nft.hooks";
import { NftCollection } from "./nft.collection";

import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { NftOwners } from "./nft.owners";

export const NftHeader = () => {
  const [nft] = useNft();

  return (
    <Card className={cn("p-4")}>
      <div className="relative flex w-full flex-col gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold uppercase">{nft.name}</h1>
        </div>
        <span className="text-sm">{nft.description}</span>

        <NftCollection />

        <div className="flex items-end justify-between">
          <span className="text-muted-foreground text-[10px] font-bold uppercase">
            {nft.tokenType}
          </span>
          <NftOwners />
        </div>
      </div>
    </Card>
  );
};
