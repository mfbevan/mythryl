"use client";

import { useSession } from "next-auth/react";

import { api } from "~/trpc/react";
import { useIsAuthenticated } from "~/components/auth/auth.hooks";
import type { OnboardingStatus } from "~/server/db/schema";

export const useOnboardingStatus = () => {
  const isAuthenticated = useIsAuthenticated();

  const query = api.onboarding.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  return {
    ...query,
    status: query.data?.status ?? ("pending" as OnboardingStatus),
    address: query.data?.address ?? null,
    authAddressStatus: query.data?.authAddressStatus ?? null,
    authAddressApprovalUrl: query.data?.authAddressApprovalUrl ?? null,
    isComplete: query.data?.status === "complete",
  };
};

export const useHasFid = () => {
  const session = useSession();
  return !!session.data?.user?.fid;
};

export const useIsReadonly = () => {
  const { status } = useOnboardingStatus();
  return status === "readonly";
};

export const useCanPerformActions = () => {
  const { isComplete } = useOnboardingStatus();
  return isComplete;
};
