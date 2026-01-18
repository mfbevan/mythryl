import { env } from "~/env.app";
import { resolveChain, type RawChain } from "./chains.service";
import type { Chain } from "thirdweb";
import { activeChain } from "./thirdweb.service";

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (env.VERCEL_ENV === "production") {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return `http://localhost:3000`;
};

export const getBaseDomain = (): string => {
  if (typeof window !== "undefined") {
    return window.location.host;
  }

  if (env.VERCEL_ENV === "production") {
    return env.VERCEL_PROJECT_PRODUCTION_URL!;
  }

  if (env.VERCEL_URL) {
    return env.VERCEL_URL;
  }

  return "localhost:3000";
};

export const createLiveUrl = (url: string) => {
  const _url = url.startsWith("/") ? url.slice(1) : url;

  return `https://mythryl.com/${_url}`;
};

export const createLiveApiUrl = (url: string) => {
  const _url = url.startsWith("/") ? url.slice(1) : url;

  return `https://api.mythryl.com/${_url}`;
};

export const createAssetUrl = (url: string) => {
  const _url = new URL("https://cdn.mythryl.com");

  _url.pathname = `/${url.startsWith("/") ? url.slice(1) : url}`;
  return _url.toString();
};

export const createExplorerTxUrl = ({ txHash }: { txHash: string }) => {
  const { blockExplorers } = activeChain;
  return `${blockExplorers?.[0]?.url}/tx/${txHash}`;
};

export const createExplorerAddressUrl = ({
  chain = activeChain,
  address,
}: {
  chain?: Chain | string | number;
  address?: string;
}) => {
  const { blockExplorers } = resolveChain(chain);
  return `${blockExplorers?.[0]?.url}/address/${address}`;
};

interface CreateCoinLinkProps {
  address?: string;
  chain?: Chain | string | number;
}

export const createUniswapCoinLink = ({
  address,
  chain = "base",
}: CreateCoinLinkProps) => {
  const { name } = resolveChain(chain);
  return `https://app.uniswap.org/explore/tokens/${name?.toLowerCase()}/${address}`;
};

export const createZoraCoinLink = ({
  address,
  chain = "base",
}: CreateCoinLinkProps) => {
  const { name } = resolveChain(chain);
  return `https://zora.co/coin/${name?.toLowerCase()}:${address}`;
};

export const createDexScreenerCoinLink = ({
  address,
  chain = "base",
}: CreateCoinLinkProps) => {
  const { name } = resolveChain(chain);
  return `https://dexscreener.com/${name?.toLowerCase()}/${address}`;
};

export const createClankerCoinLink = ({ address }: CreateCoinLinkProps) => {
  return `https://www.clanker.world/clanker/${address}`;
};

export const createGeckoTerminalEmbedLink = ({
  address,
  chain = "base",
  type = "price",
}: {
  address?: string;
  chain?: Chain | string | number;
  type?: "price" | "market_cap";
}) => {
  const { name } = resolveChain(chain);
  return `https://www.geckoterminal.com/${name?.toLowerCase()}/pools/${address}?embed=1&info=0&swaps=0&grayscale=0&light_chart=1&chart_type=${type}&resolution=15m`;
};

export const createDexScreenerEmbedLink = ({
  address,
  chain = "base",
}: {
  address?: string | null;
  chain?: Chain | string | number;
}) => {
  const { name } = resolveChain(chain);
  return `https://dexscreener.com/${name?.toLowerCase()}/${address}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTimeframesToolbar=0&loadChartSettings=0&chartTheme=light&theme=light&chartStyle=0&chartType=usd&interval=15`;
};

export const createMagicEdenLink = ({
  chain,
  address,
  tokenId,
}: {
  chain: RawChain;
  address: string;
  tokenId: string | number;
}) => {
  const { name } = resolveChain(chain);

  return `https://magiceden.io/item-details/${name?.toLowerCase()}/${address}/${tokenId}`;
};

export const createOpenSeaLink = ({
  chain,
  address,
  tokenId,
}: {
  chain: RawChain;
  address: string;
  tokenId: string | number;
}) => {
  const { name } = resolveChain(chain);

  return `https://opensea.io/assets/${name?.toLowerCase()}/${address}/${tokenId}`;
};

export const createNftEmbedLink = (
  chainId: number,
  address: string,
  tokenId: bigint,
) => {
  return createLiveUrl(
    `/api/images/collections/${chainId}/${address}/${tokenId}`,
  );
};
