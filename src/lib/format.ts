import { intervalToDuration } from "date-fns";
import { formatNumber, shortenLargeNumber, toTokens } from "thirdweb/utils";

const MAX_DECIMALS = 6;

export const formatAmount = (amount: number | string) => {
  return Number(amount).toLocaleString("en-US");
};

export const formatPrice = (
  price?: string | number,
  decimals = MAX_DECIMALS,
) => {
  if (price === undefined || price === null) return "-";
  if (price === 0) return "$0.00";
  if (Number(price) < 0.01) return "<$0.01";

  return formatNumber(Number(price ?? 0), decimals).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatTokenAmount = (
  price?: string | number,
  decimals = MAX_DECIMALS,
) => {
  return formatNumber(Number(price ?? 0), decimals).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
};

export const weiToDisplay = (
  wei: string | bigint = "0",
  decimals = 18,
  shortDecimals = 6,
) => {
  const tokens = toTokens(BigInt(wei), decimals);

  return shortenLargeNumber(formatNumber(Number(tokens), shortDecimals));
};

export const formatSmallPrice = (price?: string | number, totalLength = 8) => {
  const num = Number(price ?? 0);
  if (num >= 0.01) {
    // For larger prices, use normal formatting
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  // Convert to string and split at the decimal
  const [whole, decimal = ""] = num.toFixed(10).split(".");
  // Count leading zeros after the decimal
  const match = /^(0+)/.exec(decimal);
  const zeroCount = match ? match[1]?.length : 0;

  // Subscript numbers 0-9
  const subscripts = "₀₁₂₃₄₅₆₇₈₉";
  const subscript =
    zeroCount && zeroCount > 0
      ? Array.from(String(zeroCount))
          .map((d) => subscripts[+d])
          .join("")
      : "";

  // Remove leading zeros for the rest of the decimal
  const rest = decimal.slice(zeroCount);

  // Remove trailing zeros for display
  const trimmedRest = rest.replace(/0+$/, "");
  const str = `$${whole}.0${subscript}${trimmedRest}`.slice(0, totalLength);

  return str;
};

export const formatInterval = (_seconds: number | bigint) => {
  const { days, hours, minutes, seconds } = intervalToDuration({
    start: 0,
    end: Number(_seconds) * 1000,
  });

  if (days) {
    if (days > 1) return `${days} days`;
    return `${days} day`;
  }

  if (hours) {
    if (hours > 1) return `${hours} hours`;
    return `${hours} hour`;
  }

  if (minutes) {
    if (minutes > 1) return `${minutes} mins`;
    return `${minutes} min`;
  }

  if (seconds) {
    if (seconds > 1) return `${seconds} secs`;
    return `${seconds} sec`;
  }

  return "0s";
};
