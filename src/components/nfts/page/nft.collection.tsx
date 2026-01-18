"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useNft } from "./nft.hooks";

import { createNftCollectionLink } from "~/components/navigation/navigation";

export const NftCollection = () => {
  const [nft] = useNft();

  if (!nft?.chainId || !nft?.address) return null;

  const image = nft.collection.image ?? nft.image?.thumbnailUrl;

  return (
    <Link
      href={createNftCollectionLink({
        chainId: nft?.chainId,
        address: nft?.address,
      })}
      className="bg-secondary flex items-center justify-between gap-2 rounded-md px-2 py-2"
    >
      <img src={image} alt={nft?.collection?.name} className="size-6 rounded" />
      <span className="line-clamp-1 flex-1 text-sm font-medium">
        {nft?.collection?.name}
      </span>
      <ArrowRight className="mr-1.5 size-3" />
    </Link>
  );
};
