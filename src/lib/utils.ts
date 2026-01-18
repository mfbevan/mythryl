import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toTitleCase = (str?: string | number | null) => {
  if (!str) return "";
  return str.toString().charAt(0).toUpperCase() + str.toString().slice(1);
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isNullOrUndefined = (value: unknown) =>
  value === null || value === undefined;
