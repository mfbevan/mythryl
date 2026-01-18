"use client";

import { useNft } from "./nft.hooks";

import type { Attribute } from "~/server/api/schema/metadata.validator";

export const NftAttributes = () => {
  const [nft] = useNft();
  if (!nft) return null;

  const attributes: Attribute[] = nft.metadata?.attributes ?? [];

  if (attributes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid h-fit w-full grid-cols-2 items-start gap-2 px-2">
        {attributes.map(({ trait_type, value }, index) => (
          <ItemAttribute
            key={`${trait_type}-${index}`}
            attributeKey={trait_type}
            value={value}
          />
        ))}
      </div>
    </div>
  );
};

const ItemAttribute = ({
  attributeKey,
  value,
}: {
  attributeKey: string;
  value: unknown;
}) => {
  return (
    <div className="bg-muted/50 flex flex-col gap-0.5 rounded-md border p-2">
      <span className="text-muted-foreground text-[10px] font-light uppercase">
        {attributeKey}
      </span>
      <span className="truncate text-xs">{value?.toString()}</span>
    </div>
  );
};
