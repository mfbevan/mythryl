"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "~/lib/utils";

import { useWindowActions } from "./provider";
import { WindowContent } from "./windows.content";
import { WindowIcon } from "./windows.icon";
import { WindowLabel } from "./windows.label";
import type { WindowInstance } from "./windows.schema";

const WINDOW_WIDTH = 375;
const WINDOW_HEIGHT = 695;
const HEADER_HEIGHT = 40;
const MINIMIZED_WIDTH = 120;

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

interface WindowTabProps {
  instance: WindowInstance;
}

export function WindowTab({ instance }: WindowTabProps) {
  const { toggleWindow, removeWindow } = useWindowActions();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: instance.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = () => {
    // Blur any focused iframe before toggling
    if (document.activeElement?.tagName === "IFRAME") {
      (document.activeElement as HTMLElement).blur();
    }
    toggleWindow(instance.key);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={false}
      animate={{
        width: instance.isOpen ? WINDOW_WIDTH : MINIMIZED_WIDTH,
        height: instance.isOpen ? WINDOW_HEIGHT : HEADER_HEIGHT,
      }}
      transition={springTransition}
      className={cn(
        "bg-background border rounded-lg shadow-lg overflow-hidden shrink-0",
        isDragging && "opacity-50 shadow-2xl z-50"
      )}
    >
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors select-none touch-none whitespace-nowrap"
        style={{ height: HEADER_HEIGHT }}
      >
        <WindowIcon window={instance.window} className="size-4" />
        <span className="text-sm font-medium truncate flex-1 min-w-0">
          <WindowLabel window={instance.window} />
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeWindow(instance.key);
          }}
          className="p-0.5 rounded hover:bg-muted-foreground/20 transition-colors shrink-0"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {instance.isOpen && (
        <div
          className="overflow-hidden border-t"
          style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT - HEADER_HEIGHT }}
        >
          <WindowContent window={instance.window} windowId={instance.key} />
        </div>
      )}
    </motion.div>
  );
}
