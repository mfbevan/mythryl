import { z } from "zod";

import { publicProcedure } from "~/server/api/trpc";
import { type TokenData, MOCK_TOKENS, DEFAULT_TOKEN } from "./token.schema";

export const getToken = publicProcedure
  .input(
    z.object({
      address: z.string().min(1),
      chainId: z.number(),
    }),
  )
  .query(async ({ input }): Promise<TokenData> => {
    const { address, chainId } = input;
    const normalizedAddress = address.toLowerCase();

    // TODO: Replace with real token data API (e.g., CoinGecko, DeFiLlama, etc.)
    const tokenData = MOCK_TOKENS[normalizedAddress] ?? DEFAULT_TOKEN;

    return {
      address,
      chainId,
      ...tokenData,
    };
  });
