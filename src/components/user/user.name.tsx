import { AccountName, AccountAddress } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

import { cn } from "~/lib/utils";

export const UserName = ({ className }: { className?: string }) => {
  return (
    <AccountName
      className={cn(className, "")}
      socialType="farcaster"
      fallbackComponent={
        <AccountAddress
          className={cn(className, "")}
          formatFn={(s) => shortenAddress(s)}
        />
      }
      loadingComponent={
        <AccountAddress
          className={cn(className, "")}
          formatFn={(s) => shortenAddress(s)}
        />
      }
    />
  );
};
