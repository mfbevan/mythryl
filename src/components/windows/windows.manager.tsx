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
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Minus, Wallet, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

import { useWindowActions, useWindows } from "./provider";
import { WindowTab } from "./windows.tab";
import { WindowContent } from "./windows.content";
import { WindowIcon } from "./windows.icon";
import { WindowLabel } from "./windows.label";

const OPEN_WINDOW_WIDTH = 375;
const CLOSED_WINDOW_WIDTH = 120;
const GAP = 8;
const PADDING = 16;

export function WindowManager() {
  const windows = useWindows();
  const {
    closeOldestOpenWindow,
    reorderWindows,
    openWindow,
    minimizeAllWindows,
    removeWindow,
    toggleWindowByType,
  } = useWindowActions();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const sortedWindows = Array.from(windows.values()).sort(
    (a, b) => a.order - b.order,
  );

  const activeWindow = sortedWindows.find((w) => w.isOpen);

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

  // Blur iframes when clicking outside of windows
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        document.activeElement?.tagName === "IFRAME" &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        (document.activeElement as HTMLElement).blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        reorderWindows(active.id as string, over.id as string);
      }
    },
    [reorderWindows],
  );

  const quickAccessButtons = [
    {
      icon: Wallet,
      label: "Wallet",
      onClick: () => toggleWindowByType({ type: "wallet" }),
    },
    {
      icon: MessageSquare,
      label: "Messages",
      onClick: () => toggleWindowByType({ type: "message" }),
    },
  ];

  if (isMobile) {
    return (
      <AnimatePresence>
        {activeWindow && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-background fixed inset-0 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-medium">
                <WindowLabel window={activeWindow.window} />
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => minimizeAllWindows()}
                  className="hover:bg-muted-foreground/20 rounded p-1.5 transition-colors"
                >
                  <Minus className="size-4" />
                </button>
                <button
                  onClick={() => removeWindow(activeWindow.key)}
                  className="hover:bg-muted-foreground/20 rounded p-1.5 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <WindowContent window={activeWindow.window} windowId={activeWindow.key} />
            </div>

            {/* Tab bar */}
            <div className="bg-muted/50 flex items-center justify-center gap-2 border-t px-4 py-3">
              {sortedWindows.map((instance) => {
                const isActive = instance.key === activeWindow.key;
                return (
                  <button
                    key={instance.key}
                    onClick={() => openWindow(instance.key)}
                    className={cn(
                      "rounded-lg p-2.5 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted-foreground/20",
                    )}
                  >
                    <WindowIcon window={instance.window} className="size-5" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-row items-end gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedWindows.map((w) => w.key)}
          strategy={horizontalListSortingStrategy}
        >
          <div ref={containerRef} className="flex flex-row items-end gap-2">
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

      {/* Quick Access Buttons */}
      <div className="flex flex-col gap-2">
        {quickAccessButtons.map((button) => (
          <Button
            key={button.label}
            onClick={button.onClick}
            variant="outline"
            size="iconLg"
            className="shadow-lg"
            title={button.label}
          >
            <button.icon className="" />
          </Button>
        ))}
      </div>
    </div>
  );
}
