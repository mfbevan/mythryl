"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useMiniapp } from "../windows.hooks";

interface MiniappWindowContentProps {
  url: string;
}

export const MiniappWindowContent = ({ url }: MiniappWindowContentProps) => {
  const { app, isLoading, isError } = useMiniapp(url);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
        <span className="text-muted-foreground text-sm">Loading app...</span>
      </div>
    );
  }

  if (isError || !app) {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    return (
      <div className="relative h-full w-full overflow-hidden">
        <iframe
          src={fullUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="clipboard-write; web-share"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {app.config.splashImageUrl && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300"
          style={{
            backgroundColor: app.config.splashBackgroundColor ?? "#000",
          }}
        >
          <Image
            src={app.config.splashImageUrl}
            alt={app.config.name}
            width={128}
            height={128}
            className="rounded-xs object-contain"
            unoptimized
          />
        </div>
      )}
      <iframe
        src={app.config.homeUrl}
        className="absolute inset-0 z-10 h-full w-full border-0"
        allow="clipboard-write; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={(e) => {
          const splash = e.currentTarget.previousElementSibling;
          if (splash) {
            splash.classList.add("opacity-0", "pointer-events-none");
          }
        }}
      />
    </div>
  );
};
