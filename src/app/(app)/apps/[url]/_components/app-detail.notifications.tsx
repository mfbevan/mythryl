"use client";

import { BellIcon, BellOffIcon } from "lucide-react";

import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";

export type AppDetailNotificationsProps = {
  url: string;
  enabled: boolean;
};

export const AppDetailNotifications = ({
  url,
  enabled,
}: AppDetailNotificationsProps) => {
  const utils = api.useUtils();
  const updateNotifications = api.apps.updateNotifications.useMutation({
    onSuccess: () => {
      void utils.apps.getApp.invalidate({ url });
    },
  });

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        {enabled ? (
          <BellIcon className="text-primary size-5" />
        ) : (
          <BellOffIcon className="text-muted-foreground size-5" />
        )}
        <div>
          <p className="font-medium">Notifications</p>
          <p className="text-muted-foreground text-sm">
            Receive updates from this app
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={(checked) =>
          updateNotifications.mutate({ url, enabled: checked })
        }
        disabled={updateNotifications.isPending}
      />
    </div>
  );
};
