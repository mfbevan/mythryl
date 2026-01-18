import Link from "next/link";

import { NftCard } from "./nft.card";

import { Skeleton } from "~/components/ui/skeleton";
import { createNftLink } from "~/components/navigation/navigation";
import type { Nft } from "~/server/db/schema";

export const NftsGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
};

export const NftGridItem = ({ nft }: { nft: Nft }) => {
  return (
    <Link prefetch={false} href={createNftLink(nft)} className="cursor-pointer">
      <NftCard nft={nft} />
    </Link>
  );
};

export const NftGridSkeleton = () => {
  return <Skeleton className="aspect-square h-full w-full max-w-xs" />;
};

export const NftGridEmpty = () => {
  return (
    <div className="bg-card/50 flex aspect-square w-full max-w-xs flex-col gap-2 rounded-lg border-2 border-dashed opacity-50 backdrop-blur-xl" />
  );
};

// Helper function to generate empty slots for grid alignment (3 columns)
export const generateEmptySlots = (totalItems: number, gridColumns = 3) => {
  const remainder = totalItems % gridColumns;
  return remainder === 0 ? 0 : gridColumns - remainder;
};
