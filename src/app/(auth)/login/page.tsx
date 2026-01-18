import { SessionProvider } from "next-auth/react";
import { LoginAuth } from "~/components/auth/login/login.auth";
import { LoginSocials } from "~/components/auth/login/login.socials";
import { LoginVersion } from "~/components/auth/login/login.version";

import { auth } from "~/server/auth";
import { LoginTheme } from "~/components/auth/login/login.theme";
import { redirect } from "next/navigation";
import { homeUrl } from "~/components/navigation/navigation";
import { FarcasterProvider } from "~/components/farcaster/farcaster.provider";
import { ThirdwebProvider } from "thirdweb/react";

interface LoginPageProps {
  searchParams: Promise<{
    redirectUrl?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  const redirectUrl = params.redirectUrl ?? homeUrl;

  if (session) {
    redirect(redirectUrl);
  }

  return (
    <ThirdwebProvider>
      <SessionProvider session={session}>
        <FarcasterProvider>
          <div className="flex h-screen w-screen flex-col items-center justify-center">
            <LoginAuth />
            <LoginTheme />
            <LoginSocials />
            <LoginVersion />
          </div>
        </FarcasterProvider>
      </SessionProvider>
    </ThirdwebProvider>
  );
}
