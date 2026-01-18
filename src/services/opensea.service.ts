import { env } from "~/env.app";
import { OpenSeaSDK, Chain } from "opensea-js";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { resolveChain, type RawChain } from "./chains.service";
import { client } from "./thirdweb.service";

const apiKey = env.OPENSEA_API_KEY;

const getOpenSeaChain = (chainId: number) => {
  switch (chainId) {
    case 8453:
      return Chain.Base;
    default:
      throw new Error(`Unsupported chain: ${chainId}`);
  }
};

export const opensea = (chainId: RawChain) => {
  const chain = resolveChain(chainId);

  return new OpenSeaSDK(ethers6Adapter.provider.toEthers({ client, chain }), {
    apiKey,
    chain: getOpenSeaChain(chain.id),
  });
};
