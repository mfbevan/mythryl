"use client";

import { api } from "~/trpc/react";
import { useIsAuthenticated } from "../auth/auth.hooks";

export const useCurrentUser = () => {
  const enabled = useIsAuthenticated();

  const query = api.users.getCurrentUser.useQuery(undefined, { enabled });

  return [query.data, query] as const;
};

export const useUser = (userId?: string | null) => {
  const query = api.users.getUser.useQuery(
    { userId: userId! },
    { enabled: !!userId },
  );

  return [query.data, query] as const;
};
