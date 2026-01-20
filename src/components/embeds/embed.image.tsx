"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import type { EmbedUrl } from "~/server/api/routers/feed/feed.schema";

interface EmbedImageProps {
  embed: EmbedUrl;
}

export const EmbedImage = ({ embed }: EmbedImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="shrink-0 cursor-pointer overflow-hidden rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <img
          src={embed.url}
          alt=""
          className="max-h-[300px] rounded-lg object-cover"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent"
          showCloseButton={false}
          onClick={() => setIsOpen(false)}
        >
          <DialogTitle className="sr-only">Image</DialogTitle>
          <img
            src={embed.url}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
