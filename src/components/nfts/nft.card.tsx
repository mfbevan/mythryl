import { ChainIcon } from "../chains/chain-icon";

import { cn } from "~/lib/utils";
import { resolveChain } from "~/services/chains.service";
import type { Nft } from "~/server/db/schema";

export const NftCard = ({ nft }: { nft: Nft }) => {
  const image = nft.image?.cachedUrl ?? nft.image?.thumbnailUrl;
  const chain = resolveChain(nft.chainId);

  return (
    <div className="flex cursor-pointer flex-col gap-2">
      <div
        className={cn(
          `group relative aspect-square h-full w-full overflow-hidden rounded-lg border backdrop-blur-xl`,
        )}
      >
        <>
          {/* Blurred background image */}
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl"
          />
          {/* Main NFT image at normal scale */}
          <img
            src={image}
            alt={nft.name}
            className="absolute inset-0 mx-auto my-auto h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </>

        <div className="absolute top-2 left-2">
          <ChainIcon chain={chain} className="size-3" />
        </div>
      </div>

      <span className="font-outfit line-clamp-1 text-xs font-medium">
        {nft.name}
      </span>
    </div>
  );
};
