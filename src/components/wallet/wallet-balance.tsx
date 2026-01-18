"use client";

import {
  AccountBalance,
  AccountProvider,
  useActiveAccount,
  type AccountBalanceInfo,
} from "thirdweb/react";
import { shortenLargeNumber } from "thirdweb/utils";
import { formatNumber } from "thirdweb/utils";

import { Skeleton } from "../ui/skeleton";

import { activeChain, client } from "~/services/thirdweb.service";

export const WalletBalance = () => {
  const account = useActiveAccount();

  if (!account?.address) return null;

  return (
    <AccountProvider address={account?.address} client={client}>
      <div className="flex flex-col items-end">
        <AccountBalance
          chain={activeChain}
          className="font-mono text-xs leading-none"
          loadingComponent={<Skeleton className="h-3 w-10" />}
          fallbackComponent={<p className="text-xs leading-none">- USD</p>}
          showBalanceInFiat="USD"
          formatFn={(props) =>
            formatAccountFiatBalance({ ...props, decimals: 2 })
          }
        />
        <AccountBalance
          chain={activeChain}
          className="text-xl leading-none font-extrabold"
          loadingComponent={<Skeleton className="h-5 w-20" />}
          fallbackComponent={<p className="text-xl">- ETH</p>}
        />
      </div>
    </AccountProvider>
  );
};

/**
 * DUPLICATED FROM thirdweb/react
 * Used internally for the Details button and Details Modal
 * @internal
 */
export function formatAccountFiatBalance(
  props: AccountBalanceInfo & { decimals: number },
) {
  const num = formatNumber(props.balance, props.decimals);
  // Need to keep them short to avoid UI overflow issues
  const formattedFiatBalance = shortenLargeNumber(num);
  return `${props.symbol}${formattedFiatBalance}`;
}
