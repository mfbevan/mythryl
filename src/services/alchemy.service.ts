import { Alchemy, Network } from "alchemy-sdk";

import { resolveChain, type RawChain } from "./chains.service";

import { env } from "~/env.app";

const getAlchemyNetwork = (chain: RawChain) => {
  const resolvedChain = resolveChain(chain);

  switch (resolvedChain.id) {
    case 1:
      return Network.ETH_MAINNET;
    case 42161:
      return Network.ARB_MAINNET;
    case 8453:
      return Network.BASE_MAINNET;
    case 84532:
      return Network.BASE_SEPOLIA;
    default:
      throw new Error(`Unsupported network: ${resolvedChain.id}`);
  }
};

export const alchemy = (chain: RawChain) =>
  new Alchemy({
    apiKey: env.ALCHEMY_API_KEY,
    network: getAlchemyNetwork(chain),
  });
