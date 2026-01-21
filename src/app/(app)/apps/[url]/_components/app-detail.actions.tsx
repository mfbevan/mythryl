"use client";

import { useState } from "react";
import {
  ExternalLinkIcon,
  Grid2X2Plus,
  Grid2x2X,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { api, type RouterOutputs } from "~/trpc/react";
import { AppsAddPrompt } from "~/components/apps/apps.add-prompt";
import { useGatedWindowActions } from "~/components/windows/use-gated-window-actions";

type App = RouterOutputs["apps"]["getApp"];

export type AppDetailActionsProps = {
  app: App;
};

export const AppDetailActions = ({ app }: AppDetailActionsProps) => {
  const [addPromptOpen, setAddPromptOpen] = useState(false);
  const { addWindow } = useGatedWindowActions();

  const utils = api.useUtils();
  const removeApp = api.apps.removeApp.useMutation({
    onSuccess: () => {
      void utils.apps.getApp.invalidate({ url: app.url });
      void utils.apps.listApps.invalidate();
      void utils.apps.getUserApps.invalidate();
    },
  });

  const handleOpenApp = () => {
    addWindow({ type: "miniapp", url: `https://${app.url}` });
  };

  const handleVisitSite = () => {
    window.open(`https://${app.url}`, "_blank");
  };

  return (
    <>
      <div className="flex w-full flex-wrap gap-2 md:w-fit">
        <Button className="flex-1 md:flex-none" onClick={handleOpenApp}>
          Open
        </Button>

        {app.userMiniapp ? (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeApp.mutate({ url: app.url })}
            isLoading={removeApp.isPending}
          >
            <Grid2x2X className="size-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setAddPromptOpen(true)}
          >
            <Grid2X2Plus className="size-4" />
          </Button>
        )}
      </div>

      <AppsAddPrompt
        app={app}
        open={addPromptOpen}
        onOpenChange={setAddPromptOpen}
      />
    </>
  );
};
