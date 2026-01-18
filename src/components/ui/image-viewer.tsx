"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "~/lib/utils";

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}

export const ImageViewer = ({
  src,
  alt,
  className,
  children,
}: ImageViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  return (
    <>
      <div onClick={openFullscreen} className={cn("cursor-pointer", className)}>
        {children ?? <img src={src} alt={alt} className="h-full w-full object-cover" />}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeFullscreen}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeFullscreen}
          >
            <X className="h-6 w-6" />
          </Button>

          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
