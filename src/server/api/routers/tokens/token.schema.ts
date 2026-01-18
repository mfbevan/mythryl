import { z } from "zod";

export const tokenDataSchema = z.object({
  address: z.string(),
  chainId: z.number(),
  name: z.string(),
  symbol: z.string(),
  icon: z.string().optional(),
  price: z.number(),
  change24h: z.number(),
  marketCap: z.number(),
  volume24h: z.number(),
  totalSupply: z.number(),
  holders: z.number(),
  description: z.string(),
});

export type TokenData = z.infer<typeof tokenDataSchema>;

// Dummy data for development - replace with real API calls
export const MOCK_TOKENS: Record<string, Omit<TokenData, "address" | "chainId">> = {
  "0x4ed4e862860bed51a9570b96d89af5e1b0efefed": {
    name: "Degen",
    symbol: "DEGEN",
    icon: "https://assets.coingecko.com/coins/images/34515/small/degen.png",
    price: 0.0085,
    change24h: 12.5,
    marketCap: 150000000,
    volume24h: 25000000,
    totalSupply: 36965920000,
    holders: 125000,
    description: "The tipping token of Farcaster",
  },
  "0x0578d8a44db98b23bf096a382e016e29a5ce0ffe": {
    name: "Higher",
    symbol: "HIGHER",
    icon: "https://assets.coingecko.com/coins/images/36084/small/higher.jpg",
    price: 0.0089,
    change24h: -3.2,
    marketCap: 85000000,
    volume24h: 8500000,
    totalSupply: 10000000000,
    holders: 45000,
    description: "Aim higher",
  },
};

export const DEFAULT_TOKEN: Omit<TokenData, "address" | "chainId"> = {
  name: "Unknown Token",
  symbol: "???",
  icon: undefined,
  price: 0,
  change24h: 0,
  marketCap: 0,
  volume24h: 0,
  totalSupply: 0,
  holders: 0,
  description: "Token information not available",
};
