import {
  ethereum as ethereumThirdweb,
  base as baseThirdweb,
  arbitrum as arbitrumThirdweb,
  baseSepolia as baseSepoliaThirdweb,
  monad as monadThirdweb,
  type Chain as ThirdwebChain,
  defineChain,
} from "thirdweb/chains";
import { unichain } from "viem/chains";

export const unichainThirdweb = defineChain(
  unichain as unknown as ThirdwebChain,
);

export const supportedChains = [
  ethereumThirdweb,
  baseThirdweb,
  arbitrumThirdweb,
];

export const clankerSupportedChains = [
  ethereumThirdweb,
  baseThirdweb,
  arbitrumThirdweb,
  monadThirdweb,
  unichainThirdweb,
];

export type RawChain = ThirdwebChain | string | number;
export type ClankerChainId = 1 | 143 | 8453 | 10143 | 2741 | 84532 | 42161 | 130

export const resolveChain = (rawChain?: RawChain) => {
  if (!rawChain) throw new Error("Chain not found");

  if (typeof rawChain === "string" || typeof rawChain === "number") {
    const chain = rawChain.toString();

    if (chain === "ethereum" || chain === "1") return ethereumThirdweb;
    if (chain === "arbitrum" || chain === "42161") return arbitrumThirdweb;
    if (chain === "base" || chain === "8453") return baseThirdweb;
    if (chain === "base-sepolia" || chain === "84532")
      return baseSepoliaThirdweb;
    if (chain === "unichain" || chain === "130") return unichainThirdweb;

    throw new Error(`Chain ${chain} not found`);
  }

  return rawChain;
};
