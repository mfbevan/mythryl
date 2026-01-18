"use client";

import { Globe } from "lucide-react";
import { shortenAddress } from "thirdweb/utils";
import { ChainIcon, ChainProvider } from "thirdweb/react";

import { formatTokenId } from "../nft.format";

import { useNft } from "./nft.hooks";

import { createExplorerAddressUrl } from "~/services/url.service";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import { client } from "~/services/thirdweb.service";
import { resolveChain } from "~/services/chains.service";
import { Card } from "~/components/ui/card";

const chainClassName = "inline size-4 rounded-full";

export const NftChainDetails = () => {
  const [nft] = useNft();
  if (!nft) return null;

  const chain = resolveChain(nft.chainId);

  const details = [
    {
      label: "Contract Address",
      value: (
        <a
          href={createExplorerAddressUrl({
            chain: nft.chainId,
            address: nft.address,
          })}
          target="_blank"
          className="flex items-center gap-1 transition-colors duration-200"
        >
          {shortenAddress(nft.address)}
          <Globe className="inline size-3" />
        </a>
      ),
    },
    { label: "Token ID", value: formatTokenId(nft.tokenId) },
    { label: "Token Standard", value: nft.isErc721 ? "ERC-721" : "ERC-1155" },
    {
      label: "Chain",
      value: (
        <ChainProvider chain={chain}>
          <span className="flex items-center gap-1">
            <ChainIcon
              loadingComponent={<Skeleton className={cn(chainClassName)} />}
              fallbackComponent={<Skeleton className={cn(chainClassName)} />}
              client={client}
              className={cn(chainClassName)}
            />
            {chain.name}
          </span>
        </ChainProvider>
      ),
    },
  ];

  return (
    <Card className="p-4">
      {/* <div className="flex items-center gap-2 font-semibold uppercase">
        Token Details
      </div> */}
      <div className="space-y-2 text-sm">
        {details.map(({ label, value }) => (
          <div className="flex justify-between" key={label}>
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className="">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
