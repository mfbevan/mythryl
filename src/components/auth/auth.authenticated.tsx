"use client";

import { useIsAuthenticated } from "./auth.hooks";

export const AuthenticatedOnly = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return null;

  return children;
};

export const UnauthenticatedOnly = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) return null;

  return children;
};
