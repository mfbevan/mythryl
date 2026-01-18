"use client";

import { api } from "~/trpc/react";

export const useMiniapp = (url: string) => {
  const query = api.apps.getApp.useQuery(
    { url },
    {
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
    },
  );

  return {
    app: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
