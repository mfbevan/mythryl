"use client";

import { useMemo } from "react";
import { cn } from "../../lib/utils";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1557683316-973673baf926",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
];

export interface SidebarBackgroundProps {
  className?: string;
  images?: string[];
}

export const SidebarBackground = ({
  className,
  images,
}: SidebarBackgroundProps) => {
  const imageUrl = useMemo(() => {
    const imageArray = images && images.length > 0 ? images : DEFAULT_IMAGES;
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
  }, [images]);

  return (
    <img
      className={cn(
        "absolute inset-0 h-full w-full object-cover opacity-10",
        className,
      )}
      alt="background"
      src={imageUrl}
    />
  );
};
