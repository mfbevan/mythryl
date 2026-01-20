"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertCircle, ExternalLink } from "lucide-react";

import { OnboardingFlow } from "./onboarding.flow";
import { useOnboardingStatus, useHasFid } from "./onboarding.hooks";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

interface OnboardingGateProps {
  children: React.ReactNode;
}

export const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const session = useSession();
  const router = useRouter();
  const isAuthenticated = session.status === "authenticated";
  const { isComplete, isLoading, isError } = useOnboardingStatus();
  const hasFid = useHasFid();

  // Redirect unauthenticated users to signin
  useEffect(() => {
    if (session.status === "unauthenticated") {
      const currentPath = window.location.pathname;
      router.push(`/signin?redirectUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [session.status, router]);

  // Show loading state while session is loading
  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Unauthenticated - will redirect
  if (session.status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Show loading while fetching onboarding status (only when authenticated)
  if (isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // If onboarding query fails, skip onboarding gate (db might not be migrated)
  if (isError) {
    console.warn("Onboarding status query failed, skipping gate");
    return <>{children}</>;
  }

  // Authenticated but no FID - show Farcaster required screen
  if (!hasFid) {
    return <FarcasterRequiredScreen />;
  }

  // Onboarding not complete - show onboarding flow
  if (!isComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome to Mythryl</h1>
          <p className="text-muted-foreground mt-2">
            Let&apos;s get you set up in a few quick steps
          </p>
        </div>
        <OnboardingFlow />
      </div>
    );
  }

  // Onboarding complete - render app content
  return <>{children}</>;
};

const FarcasterRequiredScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Farcaster Account Required</h1>
          <p className="text-muted-foreground">
            Mythryl is currently only available to Farcaster users. Your wallet
            address doesn&apos;t appear to be linked to a Farcaster account.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() =>
              window.open("https://farcaster.xyz/~/r/mfbevan.eth", "_blank")
            }
            className="w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Create Farcaster Account
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/signin")}
            className="w-full"
          >
            Sign in with Different Account
          </Button>
        </div>

        <p className="text-muted-foreground text-xs">
          If you recently created a Farcaster account and linked your wallet,
          try signing out and signing back in.
        </p>
      </div>
    </div>
  );
};
