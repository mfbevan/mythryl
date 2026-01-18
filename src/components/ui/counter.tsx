import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Define the component's props
export interface CounterProps {
  /** The value to count up to */
  endValue: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Optional class name for styling the span */
  className?: string;
}

export const Counter = ({
  endValue,
  duration = 2,
  className,
}: CounterProps) => {
  // useMotionValue to store and animate the count
  const count = useMotionValue(0);

  // useTransform to format the number as a rounded integer with commas
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("en-US"),
  );

  useEffect(() => {
    // The `animate` function starts an animation on a MotionValue
    const controls = animate(count, endValue, {
      duration: duration,
      ease: "easeOut", // Optional: you can use any easing function
    });

    // The returned function is a cleanup function that stops the animation
    return controls.stop;
  }, [endValue, duration, count]); // Re-run effect when endValue or duration changes

  return <motion.span className={className}>{rounded}</motion.span>;
};
