import { createAssetUrl } from "./url.service";

export const fallbackImage = (size: "64" | "128" | "256" | "512" = "128") => {
  // return `/fallback/fallback_${size}.png`;
  return logoImage(size);
};

export const logoImage = (
  size: "512" | "256" | "128" | "64" | "transparent" = "64",
  type: "png" = "png",
) => {
  return createAssetUrl(`/logos/logo_${size}.${type}`);
};

export const farverseLogoImage = (
  size: "512" | "256" | "128" | "64" | "transparent" | "dark" = "64",
  type: "png" = "png",
) => {
  return `https://assets.foundly.dev/farverse/logos/farverse_${size}.${type}`;
};

export const icons = {
  uniswap: createAssetUrl("/icons/uniswap.png"),
  clanker: createAssetUrl("/icons/clanker.png"),
  dexscreener: createAssetUrl("/icons/dexscreener.webp"),
  farcaster: createAssetUrl("/icons/farcaster_white.png"),
  magicEden: createAssetUrl("/icons/magiceden.jpg"),
  basescan: createAssetUrl("/icons/basescan.png"),
  zora: createAssetUrl("/icons/zora.png"),
};
