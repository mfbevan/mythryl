"use client";

import { useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";

import { Button } from "~/components/ui/button";
import { isTauri, setDesktopMode, setMobileMode } from "~/lib/tauri";
import { useTauriStore } from "./tauri.store";

export function ViewModeToggle() {
  const { viewMode, toggleViewMode } = useTauriStore();

  useEffect(() => {
    if (!isTauri()) return;

    if (viewMode === "mobile") {
      void setMobileMode();
    } else {
      void setDesktopMode();
    }
  }, [viewMode]);

  if (!isTauri()) return null;

  return (
    <Button
      variant="ghost"
      size="iconSm"
      onClick={toggleViewMode}
      title={viewMode === "desktop" ? "Switch to mobile view" : "Switch to desktop view"}
    >
      {viewMode === "desktop" ? (
        <Smartphone className="size-4" />
      ) : (
        <Monitor className="size-4" />
      )}
    </Button>
  );
}
