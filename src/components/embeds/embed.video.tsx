"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import type { EmbedUrl } from "~/server/api/routers/feed/feed.schema";

interface EmbedVideoProps {
  embed: EmbedUrl;
}

export const EmbedVideo = ({ embed }: EmbedVideoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <>
      <div
        className="relative shrink-0 cursor-pointer overflow-hidden rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
      >
        <video
          src={embed.url}
          className="max-h-[300px] rounded-lg"
          preload="metadata"
          muted
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
          <div className="size-12 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="size-6 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-black"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Video</DialogTitle>
          <video
            ref={videoRef}
            src={embed.url}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </>
  );
}
