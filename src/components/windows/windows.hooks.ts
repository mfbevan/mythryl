"use client";

import { api } from "~/trpc/react";

interface UseMiniappOptions {
  enabled?: boolean;
}

export const useMiniapp = (url: string, options?: UseMiniappOptions) => {
  const enabled = options?.enabled ?? true;

  const query = api.apps.getApp.useQuery(
    { url },
    {
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      enabled: enabled && !!url,
    },
  );

  return {
    app: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
