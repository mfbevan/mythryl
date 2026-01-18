"use client";

interface TokenWindowContentProps {
  chainId: number;
  address: string;
}

export function TokenWindowContent({ chainId, address }: TokenWindowContentProps) {
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">
        Token: {address} (Chain: {chainId})
      </p>
    </div>
  );
}
