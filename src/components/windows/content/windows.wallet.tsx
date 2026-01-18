"use client";

import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";

import { Button } from "~/components/ui/button";

const DUMMY_TOKENS = [
  { symbol: "ETH", name: "Ethereum", balance: "1.2453", value: "$4,123.45", icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { symbol: "USDC", name: "USD Coin", balance: "2,500.00", value: "$2,500.00", icon: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
  { symbol: "DEGEN", name: "Degen", balance: "50,000", value: "$425.00", icon: "https://assets.coingecko.com/coins/images/34515/small/degen.png" },
  { symbol: "HIGHER", name: "Higher", balance: "10,000", value: "$89.50", icon: "https://assets.coingecko.com/coins/images/36084/small/higher.jpg" },
];

export function WalletWindowContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 text-center border-b">
        <p className="text-sm text-muted-foreground">Total Balance</p>
        <p className="text-2xl font-bold">$7,137.95</p>
      </div>

      <div className="flex gap-2 p-3 border-b">
        <Button size="sm" className="flex-1 gap-1">
          <ArrowUpRight className="size-4" />
          Send
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1">
          <ArrowDownLeft className="size-4" />
          Receive
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1">
          <RefreshCw className="size-4" />
          Swap
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {DUMMY_TOKENS.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
          >
            <img
              src={token.icon}
              alt={token.symbol}
              className="size-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{token.symbol}</p>
              <p className="text-xs text-muted-foreground">{token.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">{token.balance}</p>
              <p className="text-xs text-muted-foreground">{token.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
