"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PanelBottomClose, X } from "lucide-react";

import { WindowContent } from "~/components/windows/windows.content";
import { WindowIcon } from "~/components/windows/windows.icon";
import { WindowLabel } from "~/components/windows/windows.label";
import type { Window } from "~/components/windows/windows.schema";
import {
  getWindowByKey,
  subscribeToWindowSync,
  requestWindowSync,
  broadcastPopoutClosed,
  broadcastPopoutPopIn,
} from "~/components/tauri";
import { closeCurrentWindow } from "~/lib/tauri";

const HEADER_HEIGHT = 40;

export default function WindowPage() {
  const params = useParams();
  const windowKey = decodeURIComponent(params.key as string);
  const [windowData, setWindowData] = useState<Window | null>(null);
  const closingRef = useRef<"popin" | "close" | null>(null);

  useEffect(() => {
    // Try to get initial window state from localStorage
    const initialState = getWindowByKey(windowKey);
    if (initialState) {
      setWindowData(initialState.window);
    } else {
      // Request sync from main window
      requestWindowSync();
    }

    // Subscribe to state updates
    const unsubscribe = subscribeToWindowSync((message) => {
      if (message.type === "WINDOW_STATE_UPDATE") {
        const found = message.windows.find((w) => w.key === windowKey);
        if (found) {
          setWindowData(found.window);
        }
      }
    });

    // Handle OS-initiated window close (Cmd+W, etc.) - default to pop-in
    // Button clicks handle their own broadcasts before closing
    const handleBeforeUnload = () => {
      if (!closingRef.current) {
        // Only broadcast if not already handled by button click
        broadcastPopoutPopIn(windowKey);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [windowKey]);

  const handlePopIn = () => {
    closingRef.current = "popin";
    broadcastPopoutPopIn(windowKey);
    void closeCurrentWindow();
  };

  const handleClose = () => {
    closingRef.current = "close";
    broadcastPopoutClosed(windowKey);
    void closeCurrentWindow();
  };

  if (!windowData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      {/* Custom title bar - draggable */}
      <div
        data-tauri-drag-region
        className="bg-muted/50 flex shrink-0 cursor-move items-center gap-2 border-b px-3"
        style={{ height: HEADER_HEIGHT }}
      >
        <WindowIcon window={windowData} className="size-4" />
        <span
          data-tauri-drag-region
          className="min-w-0 flex-1 truncate text-sm font-medium"
        >
          <WindowLabel window={windowData} />
        </span>
        <button
          onClick={handlePopIn}
          className="hover:bg-muted-foreground/20 shrink-0 rounded p-1 transition-colors"
          title="Pop back into main window"
        >
          <PanelBottomClose className="size-4" />
        </button>
        <button
          onClick={handleClose}
          className="hover:bg-muted-foreground/20 shrink-0 rounded p-1 transition-colors"
          title="Close window"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-auto">
        <WindowContent window={windowData} windowId={windowKey} />
      </div>
    </div>
  );
}
