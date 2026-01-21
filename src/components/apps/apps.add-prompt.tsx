"use client";

import { useState } from "react";
import { BellIcon, BellOffIcon } from "lucide-react";

import { useIsMobile } from "~/hooks/use-mobile";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { api, type RouterOutputs } from "~/trpc/react";

type App = RouterOutputs["apps"]["getApp"];

export type AppsAddPromptProps = {
  app: App;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const AppsAddPrompt = ({
  app,
  open,
  onOpenChange,
  onSuccess,
}: AppsAddPromptProps) => {
  const isMobile = useIsMobile();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { config } = app;

  const utils = api.useUtils();
  const addApp = api.apps.addApp.useMutation({
    onSuccess: () => {
      void utils.apps.listApps.invalidate();
      void utils.apps.getApp.invalidate({ url: app.url });
      void utils.apps.getUserApps.invalidate();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleAdd = () => {
    addApp.mutate({
      url: app.url,
      notificationsEnabled,
    });
  };

  const content = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-12 rounded-lg">
          <AvatarImage src={config.iconUrl} alt={config.name} />
          <AvatarFallback className="rounded-lg">
            {config.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{config.name}</p>
          {config.subtitle && (
            <p className="text-muted-foreground truncate text-sm">
              {config.subtitle}
            </p>
          )}
        </div>
      </div>

      {config.description && (
        <p className="text-muted-foreground text-sm">{config.description}</p>
      )}

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="flex items-center gap-2">
          {notificationsEnabled ? (
            <BellIcon className="text-primary size-4" />
          ) : (
            <BellOffIcon className="text-muted-foreground size-4" />
          )}
          <span className="text-sm">Enable notifications</span>
        </div>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={setNotificationsEnabled}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add App</DrawerTitle>
            <DrawerDescription>
              Add this app to your collection for quick access
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter>
            <Button onClick={handleAdd} isLoading={addApp.isPending}>
              Add App
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add App</DialogTitle>
          <DialogDescription>
            Add this app to your collection for quick access
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} isLoading={addApp.isPending}>
            Add App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
