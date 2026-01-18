import { createAssetUrl, createLiveUrl } from "./url.service";

export type FontOptions =
  | "Outfit:wght@900"
  | "Outfit:wght@600"
  | "Outfit:wght@400"
  | "Rubik:wght@300"
  | "Rubik:wght@400"
  | "Rubik:wght@500"
  | "Rubik:wght@600"
  | "Rubik:wght@700"
  | "Rubik:wght@800"
  | "Rubik:wght@900";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";

export const embedBackgrounds = [
  createAssetUrl("/embeds/embed_bg_1.png"),
  createAssetUrl("/embeds/embed_bg_2.png"),
] as const;

export const defaultEmbeds = [
  createAssetUrl("/embeds/embed_1.png"),
  createAssetUrl("/embeds/embed_2.png"),
  createAssetUrl("/embeds/embed_3.png"),
  createAssetUrl("/embeds/embed_4.png"),
  createAssetUrl("/embeds/embed_5.png"),
] as const;

export const embedLogo = createAssetUrl("/logos/transparent.svg");

export const randomDefaultEmbed = () =>
  defaultEmbeds[Math.floor(Math.random() * defaultEmbeds.length)]!;

export const loadGoogleFont = async (font: FontOptions, text: string) => {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

  if (resource?.[1]) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      const [name] = font.split(":");
      const [, weight] = font.split("@");

      return {
        name: name!,
        weight: Number(weight) as Weight,
        data: await response.arrayBuffer(),
        style: "normal" as FontStyle,
      };
    }
  }

  throw new Error("failed to load font data");
};

export const createMintEmbedImage = (mintId: string) => {
  return createLiveUrl(`/api/embeds/mints/${mintId}`);
};

export const createMintGeneratedEmbedImage = (generationId: string) => {
  return createLiveUrl(`/api/embeds/mint-generation/${generationId}`);
};
