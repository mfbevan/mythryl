import type { Chain } from "thirdweb";
import { ChainProvider, ChainIcon as ChainIconComponent } from "thirdweb/react";

import { cn } from "~/lib/utils";
import { client } from "~/services/thirdweb.service";
import { Skeleton } from "../ui/skeleton";

export interface ChainIconProps {
  chain: Chain;
  className?: string;
}

export const ChainIcon = ({ chain, className }: ChainIconProps) => {
  return (
    <ChainProvider chain={chain}>
      <ChainIconComponent
        loadingComponent={
          <Skeleton className={cn("size-6 rounded-full", className)} />
        }
        fallbackComponent={
          <Skeleton className={cn("size-6 rounded-full", className)} />
        }
        client={client}
        className={cn("size-6 rounded-full", className)}
      />
    </ChainProvider>
  );
};
