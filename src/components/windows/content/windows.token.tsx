"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  RefreshCw,
  Share2,
  Star,
  TrendingUp,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface TokenWindowContentProps {
  chainId: number;
  address: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

const formatPrice = (price: number): string => {
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
};

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  8453: "Base",
  10: "Optimism",
  42161: "Arbitrum",
};

export const TokenWindowContent = ({ chainId, address }: TokenWindowContentProps) => {
  const [copied, setCopied] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const { data: token, isLoading } = api.tokens.getToken.useQuery(
    { address, chainId },
    { staleTime: 1000 * 60 * 5 },
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !token) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  const isPositive = token.change24h >= 0;
  const chainName = CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;

  // Generate chart data points based on token price
  const chartPoints = Array.from({ length: 24 }, () => {
    const base = token.price;
    const variance = base * 0.1;
    return base + (Math.random() - 0.5) * variance;
  });
  const minPrice = Math.min(...chartPoints);
  const maxPrice = Math.max(...chartPoints);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 border-b p-4">
        {token.icon ? (
          <img
            src={token.icon}
            alt={token.symbol}
            className="size-12 rounded-full"
          />
        ) : (
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <span className="text-lg font-bold">{token.symbol.charAt(0)}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-bold">{token.name}</h2>
            <button
              onClick={() => setIsStarred(!isStarred)}
              className="hover:bg-muted rounded p-1 transition-colors"
            >
              <Star
                className={cn(
                  "size-4",
                  isStarred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>{token.symbol}</span>
            <span>•</span>
            <span>{chainName}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="border-b p-4">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold">{formatPrice(token.price)}</span>
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="size-4" />
            ) : (
              <ArrowDownRight className="size-4" />
            )}
            {Math.abs(token.change24h).toFixed(2)}%
          </span>
        </div>
        <p className="text-muted-foreground text-xs">24h change</p>
      </div>

      {/* Mini Chart */}
      <div className="border-b p-4">
        <div className="bg-muted/30 flex h-24 items-end gap-px rounded-lg p-2">
          {chartPoints.map((price, i) => {
            const height = ((price - minPrice) / priceRange) * 100;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t-sm transition-all",
                  isPositive ? "bg-green-500/60" : "bg-red-500/60"
                )}
                style={{ height: `${Math.max(height, 5)}%` }}
              />
            );
          })}
        </div>
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>24h ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px border-b">
        <div className="bg-muted/30 p-3">
          <p className="text-muted-foreground text-xs">Market Cap</p>
          <p className="font-medium">${formatNumber(token.marketCap)}</p>
        </div>
        <div className="bg-muted/30 p-3">
          <p className="text-muted-foreground text-xs">24h Volume</p>
          <p className="font-medium">${formatNumber(token.volume24h)}</p>
        </div>
        <div className="bg-muted/30 p-3">
          <p className="text-muted-foreground text-xs">Total Supply</p>
          <p className="font-medium">{formatNumber(token.totalSupply)}</p>
        </div>
        <div className="bg-muted/30 p-3">
          <p className="text-muted-foreground text-xs">Holders</p>
          <p className="font-medium">{formatNumber(token.holders)}</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 overflow-auto p-4">
        <p className="text-muted-foreground text-sm">{token.description}</p>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground mt-3 flex items-center gap-1.5 text-xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="size-3 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </>
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t p-3">
        <Button size="sm" className="flex-1 gap-1">
          <TrendingUp className="size-4" />
          Buy
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1">
          <RefreshCw className="size-4" />
          Swap
        </Button>
        <Button size="sm" variant="outline" className="gap-1">
          <Share2 className="size-4" />
        </Button>
        <Button size="sm" variant="outline" className="gap-1" asChild>
          <a
            href={`https://basescan.org/token/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
