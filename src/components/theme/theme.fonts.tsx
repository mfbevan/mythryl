import { Outfit, Titan_One } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800", "900"],
});

const titan = Titan_One({
  subsets: ["latin"],
  variable: "--font-titan",
  weight: ["400"],
});

export const fonts = `${outfit.variable} ${titan.variable}`;
