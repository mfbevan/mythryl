import {
  RectangleHorizontal,
  RectangleVertical,
  Square,
  type LucideIcon,
} from "lucide-react";

export const aspectRatioIcons = {
  square: Square,
  landscape: RectangleHorizontal,
  portrait: RectangleVertical,
} as const;

export const aspectRatioLabels = {
  square: "Square",
  landscape: "Landscape",
  portrait: "Portrait",
} as const;

export type AspectRatioType = keyof typeof aspectRatioIcons;

interface AspectRatioIconProps {
  aspectRatio: AspectRatioType;
  className?: string;
}

export const AspectRatioIcon = ({
  aspectRatio = "square",
  className,
}: AspectRatioIconProps) => {
  const Icon: LucideIcon = aspectRatioIcons[aspectRatio] ?? Square;
  return <Icon className={className} />;
};
