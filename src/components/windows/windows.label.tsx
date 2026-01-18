"use client";

import { getWindowLabel } from "./windows.config";
import { useMiniapp } from "./windows.hooks";
import type { Window } from "./windows.schema";

interface WindowLabelProps {
  window: Window;
}

export const WindowLabel = ({ window }: WindowLabelProps) => {
  if (window.type === "miniapp" || window.type === "preview") {
    return <MiniappLabel url={window.url} isPreview={window.type === "preview"} />;
  }

  return <>{getWindowLabel(window)}</>;
};

interface MiniappLabelProps {
  url: string;
  isPreview?: boolean;
}

const MiniappLabel = ({ url }: MiniappLabelProps) => {
  const { app, isLoading } = useMiniapp(url);

  if (isLoading) {
    return <>Loading...</>;
  }

  return <>{app?.config.name ?? new URL(url.startsWith("http") ? url : `https://${url}`).hostname}</>;
};
