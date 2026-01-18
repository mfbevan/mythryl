"use client";

import { ProgressProvider as ProgressProviderBase } from "@bprogress/next/app";

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ProgressProviderBase
      height="4px"
      color="var(--color-primary)"
      options={{ showSpinner: false }}
    >
      {children}
    </ProgressProviderBase>
  );
};
