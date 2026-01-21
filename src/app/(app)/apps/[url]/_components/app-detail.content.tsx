"use client";

import { api } from "~/trpc/react";
import { AppDetailHeader } from "./app-detail.header";
import { AppDetailActions } from "./app-detail.actions";
import { AppDetailNotifications } from "./app-detail.notifications";
import { AppDetailInfo } from "./app-detail.info";
import { AppDetailSkeleton } from "./app-detail.skeleton";
import { AppDetailNotFound } from "./app-detail.not-found";

export type AppDetailContentProps = {
  url: string;
};

export const AppDetailContent = ({ url }: AppDetailContentProps) => {
  const { data: app, isLoading } = api.apps.getApp.useQuery(
    { url },
    { retry: false, refetchOnWindowFocus: false, refetchOnMount: false },
  );

  if (isLoading) {
    return <AppDetailSkeleton />;
  }

  if (!app) {
    return <AppDetailNotFound />;
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AppDetailHeader app={app} />
        <AppDetailActions app={app} />
      </div>

      <AppDetailInfo app={app} />

      {app.userMiniapp && (
        <AppDetailNotifications
          url={app.url}
          enabled={app.userMiniapp.notificationsEnabled}
        />
      )}
    </div>
  );
};
