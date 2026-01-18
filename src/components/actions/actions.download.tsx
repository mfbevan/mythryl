"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const ActionsDownload = ({ url }: { url: string }) => {
  const [downloaded, setDownloaded] = useState(false);

  const onAction = async () => {
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = url.split("/").pop() ?? "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="iconXs"
          variant="ghost"
          className="relative"
          onClick={onAction}
        >
          {downloaded ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Download className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">Download</TooltipContent>
    </Tooltip>
  );
};
