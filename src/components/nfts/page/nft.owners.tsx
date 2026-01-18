"use client";

import { AccountProvider, useActiveAccount } from "thirdweb/react";
import Link from "next/link";

import { useNft, useNftOwner } from "./nft.hooks";

import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { createProfileLink } from "~/components/navigation/navigation";
import { UserWalletAvatar } from "~/components/user/user.avatar";
import { client } from "~/services/thirdweb.service";
import { UserName } from "~/components/user/user.name";

export const NftOwners = () => {
  const [nft] = useNft();
  const [ownerAddress] = useNftOwner();
  const account = useActiveAccount();

  if (!nft || !ownerAddress) {
    return <Skeleton className="h-8 w-32 flex-col items-center" />;
  }

  return (
    <div className="flex flex-col items-end">
      <h3 className="text-muted-foreground text-[10px] font-light uppercase">
        Owned By
      </h3>

      <AccountProvider address={ownerAddress} client={client}>
        <Link
          href={createProfileLink(ownerAddress)}
          className="flex items-center gap-2"
        >
          <UserWalletAvatar
            user={{ address: ownerAddress }}
            className="size-4"
          />
          <div className="flex flex-col">
            <span className="flex items-center gap-2 text-sm leading-none font-bold">
              <UserName />
              {ownerAddress.toLowerCase() ===
                account?.address?.toLowerCase() && (
                <Badge variant="secondary">You</Badge>
              )}
            </span>
          </div>
        </Link>
      </AccountProvider>
    </div>
  );
};
