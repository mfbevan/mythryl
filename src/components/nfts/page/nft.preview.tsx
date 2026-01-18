"use client";

import { useNft } from "./nft.hooks";

import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";

export const NftPreview = () => {
  const [nft] = useNft();

  const image = nft?.image?.cachedUrl ?? nft?.image?.thumbnailUrl;

  if (!nft)
    return (
      <Skeleton className="aspect-square w-full max-w-full overflow-hidden rounded-lg border backdrop-blur-xl transition-shadow duration-200 md:max-w-md">
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      </Skeleton>
    );

  return (
    <div
      className={cn(
        `relative aspect-square h-fit w-full max-w-full overflow-hidden rounded-lg border backdrop-blur-xl transition-shadow duration-200 md:max-w-md`,
      )}
    >
      {image && (
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
            className="absolute inset-0 h-full w-full object-contain"
          />
        </>
      )}
    </div>
  );
};
