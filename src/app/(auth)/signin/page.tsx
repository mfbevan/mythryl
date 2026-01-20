"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { LoginAuth } from "~/components/auth/login/login.auth";
import { LoginVersion } from "~/components/auth/login/login.version";
import { LoginTheme } from "~/components/auth/login/login.theme";
import { useRouter, useSearchParams } from "next/navigation";
import { homeUrl } from "~/components/navigation/navigation";
import { FarcasterProvider } from "~/components/farcaster/farcaster.provider";
import { ThirdwebProvider } from "thirdweb/react";
import { Suspense, useEffect } from "react";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") ?? homeUrl;

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(redirectUrl);
    }
  }, [session, status, router, redirectUrl]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <LoginAuth />
      <LoginTheme />
      <LoginVersion />
    </div>
  );
}

export default function LoginPage() {
  return (
    <ThirdwebProvider>
      <SessionProvider>
        <FarcasterProvider>
          <Suspense
            fallback={
              <div className="flex h-screen w-screen items-center justify-center">
                Loading...
              </div>
            }
          >
            <LoginContent />
          </Suspense>
        </FarcasterProvider>
      </SessionProvider>
    </ThirdwebProvider>
  );
}
