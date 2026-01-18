export const getEmojiId = (emoji: string) => {
  // Convert emoji to array of code points to handle multi-code-unit emojis
  const codePoints = Array.from(emoji);
  if (codePoints.length === 0) throw new Error(`${emoji} is not a valid emoji`);

  // Get all code points and convert them to hex
  const hexCodes: string[] = [];

  for (const char of codePoints) {
    const codePoint = char.codePointAt(0);
    if (codePoint) {
      hexCodes.push(codePoint.toString(16));
    }
  }

  if (hexCodes.length === 0) throw new Error(`${emoji} is not a valid emoji`);

  // Join multiple code points with underscores for complex emojis
  return hexCodes.join("_");
};

export const getEmojiWebp = (emoji: string) => {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiId(emoji)}/512.webp`;
};

export const getEmojiGif = (emoji: string) => {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiId(emoji)}/512.gif`;
};

export const getEmojiPng = (emoji: string) => {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiId(emoji)}/512.png`;
};

export const getEmojiSvg = (emoji: string) => {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${getEmojiId(emoji)}/emoji.svg`;
};

export const getEmojiImage = (emoji: string) => {
  if (emoji.startsWith("https") || emoji.startsWith("/")) return emoji;
  return getEmojiSvg(emoji);
};

export const animatedEmojis = `🩷⚡💸💻🏗️🌱🪙🚧💡🔋🥇🥈🥉🐾🌏`;

export const isAnimatedEmoji = (emoji: string) => {
  return animatedEmojis.includes(emoji);
};

/**
 * Converts a country code to a flag emoji
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "US", "GB")
 * @returns Flag emoji string
 */
export const getCountryFlagEmoji = (countryCode: string): string => {
  if (countryCode?.length !== 2) return "🏳️";

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => char.charCodeAt(0) + 127397); // Convert to regional indicator symbols

  return String.fromCodePoint(...codePoints);
};
