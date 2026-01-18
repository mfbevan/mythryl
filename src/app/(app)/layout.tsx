import { SidebarMain } from "~/components/sidebar/sidebar.main";
import {
  SidebarProvider,
  SidebarInset,
  SidebarBreakpoints,
} from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";
import { api, HydrateClient } from "~/trpc/server";
import { ThirdwebProvider } from "thirdweb/react";
import { FarcasterProvider } from "~/components/farcaster/farcaster.provider";
import { env } from "~/env.app";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session) {
    await Promise.all([api.users.getCurrentUser.prefetch()]);
  }

  return (
    <ThirdwebProvider>
      <SessionProvider session={session}>
        <HydrateClient>
          <FarcasterProvider>
            <SidebarProvider>
              {env.NEXT_PUBLIC_APP_ENABLED && <SidebarMain />}
              <SidebarBreakpoints>
                <SidebarInset>{children}</SidebarInset>
              </SidebarBreakpoints>
            </SidebarProvider>
          </FarcasterProvider>
        </HydrateClient>
      </SessionProvider>
    </ThirdwebProvider>
  );
}
