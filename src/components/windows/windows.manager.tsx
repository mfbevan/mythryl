"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

import { useWindowActions, useWindows } from "./provider";
import { WindowTab } from "./windows.tab";

const OPEN_WINDOW_WIDTH = 320;
const CLOSED_WINDOW_WIDTH = 140;
const GAP = 8;
const PADDING = 16;

export function WindowManager() {
  const windows = useWindows();
  const { closeOldestOpenWindow, reorderWindows } = useWindowActions();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const sortedWindows = Array.from(windows.values()).sort((a, b) => a.order - b.order);

  const checkOverflow = useCallback(() => {
    if (isMobile || sortedWindows.length === 0) return;

    const availableWidth = window.innerWidth - PADDING * 2;
    const openWindows = sortedWindows.filter((w) => w.isOpen);
    const closedWindows = sortedWindows.filter((w) => !w.isOpen);

    const totalWidth =
      openWindows.length * OPEN_WINDOW_WIDTH +
      closedWindows.length * CLOSED_WINDOW_WIDTH +
      (sortedWindows.length - 1) * GAP;

    if (totalWidth > availableWidth && openWindows.length > 0) {
      closeOldestOpenWindow();
    }
  }, [sortedWindows, isMobile, closeOldestOpenWindow]);

  useEffect(() => {
    checkOverflow();
  }, [checkOverflow]);

  useEffect(() => {
    const handleResize = () => checkOverflow();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkOverflow]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        reorderWindows(active.id as string, over.id as string);
      }
    },
    [reorderWindows]
  );

  if (sortedWindows.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedWindows.map((w) => w.key)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          ref={containerRef}
          className={cn(
            "fixed z-50 flex items-end",
            isMobile
              ? "bottom-0 left-0 right-0 flex-row gap-1 px-2 pb-2"
              : "bottom-4 right-4 flex-row gap-2"
          )}
        >
          <AnimatePresence mode="popLayout">
            {sortedWindows.map((instance) => (
              <motion.div
                key={instance.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
                className="self-end"
              >
                <WindowTab instance={instance} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
