import Link from "next/link";
import { TrendingUp, Users } from "lucide-react";

import { ChainIcon } from "~/components/chains/chain-icon";
import { createNftCollectionLink } from "~/components/navigation/navigation";
import { Badge } from "~/components/ui/badge";
import type { Collection } from "~/server/db/schema";
import { resolveChain } from "~/services/chains.service";

export const CollectionCard = ({ collection }: { collection: Collection }) => {
  const chain = resolveChain(collection.chainId);
  const { image, bannerImage, openSeaStats } = collection;
  const backgroundImage = bannerImage ?? image;

  const floorPrice = openSeaStats?.total?.floor_price;
  const numOwners = openSeaStats?.total?.num_owners;

  return (
    <Link
      href={createNftCollectionLink({
        chainId: collection.chainId,
        address: collection.address,
      })}
      className="group block"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg border">
        {/* Background image */}
        <img
          src={backgroundImage}
          alt={collection.name}
          className="absolute inset-0 h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay at bottom */}
        <div className="from-background via-background/50 absolute inset-0 bg-linear-to-t to-transparent backdrop-blur-sm" />

        {/* Chain badge in top right */}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 z-10 pl-1 text-xs"
        >
          <ChainIcon chain={chain} className="size-3" />
          {chain.name}
        </Badge>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
          <div className="flex items-center gap-1.5">
            {/* Collection icon */}
            <div className="border-border size-12 shrink-0 overflow-hidden rounded-lg border-2 shadow-lg">
              <img
                src={image}
                alt={collection.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Text content */}
            <div className="flex min-w-0 flex-col gap-0.5">
              <h3 className="text-foreground truncate text-lg leading-none font-semibold drop-shadow-lg">
                {collection.name}
              </h3>
              <p className="text-muted-foreground truncate text-[10px] leading-tight drop-shadow">
                {collection.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          {(floorPrice !== undefined || numOwners !== undefined) && (
            <div className="mt-2 flex gap-4">
              {floorPrice !== undefined && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="text-primary h-2.5 w-2.5" />
                    <p className="text-muted-foreground text-[9px] leading-none uppercase">
                      Floor
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs leading-none font-semibold drop-shadow">
                    {floorPrice.toFixed(4)} ETH
                  </p>
                </div>
              )}
              {numOwners !== undefined && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <Users className="text-primary h-2.5 w-2.5" />
                    <p className="text-muted-foreground text-[9px] leading-none uppercase">
                      Owners
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs leading-none font-semibold drop-shadow">
                    {numOwners.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
