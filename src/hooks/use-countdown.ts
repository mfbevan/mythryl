"use client";

import { useEffect, useState } from "react";
import { intervalToDuration, isPast } from "date-fns";

interface CountdownResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * A hook that manages a countdown timer to a target date
 * Updates every second and returns the remaining time in various units
 *
 * @param targetDate - The target date to count down to
 * @returns An object containing years, months, days, hours, minutes, seconds, and isExpired flag
 *
 * @example
 * ```tsx
 * const { years, months, days, hours, minutes, seconds, isExpired } = useCountdown(new Date('2025-12-31'));
 * if (isExpired) return <div>Time's up!</div>;
 * return <div>{years}y {months}mo {days}d {hours}h {minutes}m {seconds}s</div>;
 * ```
 */
export const useCountdown = (
  targetDate: Date | null | undefined,
): CountdownResult => {
  const calculateTimeLeft = (): CountdownResult => {
    if (!targetDate) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    const target = new Date(targetDate);

    if (isPast(target)) {
      return {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

    const duration = intervalToDuration({
      start: new Date(),
      end: target,
    });

    return {
      years: duration.years ?? 0,
      months: duration.months ?? 0,
      days: duration.days ?? 0,
      hours: duration.hours ?? 0,
      minutes: duration.minutes ?? 0,
      seconds: duration.seconds ?? 0,
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft);

  useEffect(() => {
    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Then update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

/**
 * Formats a countdown into a human-readable string
 *
 * @param countdown - The countdown result from useCountdown
 * @param options - Formatting options
 * @returns A formatted string representation of the countdown
 *
 * @example
 * ```tsx
 * const countdown = useCountdown(targetDate);
 * const formatted = formatCountdown(countdown); // "2d 5h 30m 15s"
 * const shortFormatted = formatCountdown(countdown, { compact: true }); // "2d 5h"
 * ```
 */
export const formatCountdown = (
  countdown: CountdownResult,
  options?: {
    compact?: boolean;
    showSeconds?: boolean;
  },
): string => {
  const { years, months, days, hours, minutes, seconds, isExpired } = countdown;
  const { compact = false, showSeconds = true } = options ?? {};

  if (isExpired) {
    return "Expired";
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years}y`);
  }

  if (months > 0 || years > 0) {
    parts.push(`${months}mo`);
  }

  if (days > 0 || months > 0 || years > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0 || days > 0 || months > 0 || years > 0) {
    parts.push(`${hours}h`);
  }

  if (!compact || parts.length === 0) {
    if (minutes > 0 || hours > 0 || days > 0 || months > 0 || years > 0) {
      parts.push(`${minutes}m`);
    }

    if (showSeconds && (!compact || parts.length === 0)) {
      parts.push(`${seconds}s`);
    }
  }

  return parts.join(" ");
};

/**
 * Formats a countdown into a natural language string with shortened suffixes (e.g., "3mo 12d", "12d 3h")
 * Shows the two most significant non-zero time units
 *
 * @param countdown - The countdown result from useCountdown
 * @returns A shortened string representation of the countdown
 *
 * @example
 * ```tsx
 * const countdown = useCountdown(targetDate);
 * const formatted = formatCountdownNatural(countdown); // "2y 3mo" or "3mo 12d" or "12d 3h" or "5m 30s"
 * ```
 */
export const formatCountdownNatural = (countdown: CountdownResult): string => {
  const { years, months, days, hours, minutes, seconds, isExpired } = countdown;

  if (isExpired) {
    return "Ended";
  }

  // Build array of all non-zero units
  const units: Array<{ value: number; label: string }> = [];

  if (years > 0) units.push({ value: years, label: "y" });
  if (months > 0) units.push({ value: months, label: "mo" });
  if (days > 0) units.push({ value: days, label: "d" });
  if (hours > 0) units.push({ value: hours, label: "h" });
  if (minutes > 0) units.push({ value: minutes, label: "m" });
  if (seconds > 0) units.push({ value: seconds, label: "s" });

  // Show the two most significant non-zero units
  const significantUnits = units.slice(0, 2);

  if (significantUnits.length === 0) {
    return "0s";
  }

  return significantUnits.map((u) => `${u.value}${u.label}`).join(" ");
};
