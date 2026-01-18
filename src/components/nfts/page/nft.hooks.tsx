import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getContract, readContract } from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { balanceOf as erc721BalanceOf } from "thirdweb/extensions/erc721";
import { balanceOf as erc1155BalanceOf } from "thirdweb/extensions/erc1155";

import { api } from "~/trpc/react";
import { resolveChain } from "~/services/chains.service";
import { client } from "~/services/thirdweb.service";
import { erc721SignatureMintable } from "~/services/contracts/erc721";

export const useNftParams = () => {
  const params = useParams();

  const chainId = parseInt(params.chainId as string);
  const address = params.address as string;
  const tokenId = BigInt(params.tokenId as string);

  return { chainId, address, tokenId };
};

export const useNft = () => {
  const params = useNftParams();

  return api.collections.getNft.useSuspenseQuery(params);
};

export const useNftBalance = () => {
  const [nft] = useNft();
  const account = useActiveAccount();

  const query = useQuery({
    queryKey: ["nft-balance", nft?.address, nft?.tokenId, account?.address],
    queryFn: () => {
      if (!nft) return 0n;
      if (!account?.address) return 0n;

      const contract = getContract({
        client,
        chain: resolveChain(nft.chainId),
        address: nft.address,
      });

      return nft.isErc721
        ? erc721BalanceOf({
            contract,
            owner: account?.address,
          })
        : erc1155BalanceOf({
            contract,
            owner: account?.address,
            tokenId: nft.tokenId,
          });
    },
  });

  return [query.data ?? 0n, query] as const;
};

export const useNftOwner = () => {
  const [nft] = useNft();

  const query = useReadContract({
    contract: erc721SignatureMintable(resolveChain(nft.chainId), nft.address),
    method: "ownerOf",
    params: [nft.tokenId],
  });

  return [query.data ?? null, query] as const;
};
