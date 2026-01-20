"use client";

import { SidebarMain } from "~/components/sidebar/sidebar.main";
import {
  SidebarProvider,
  SidebarInset,
  SidebarBreakpoints,
} from "~/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { ThirdwebProvider } from "thirdweb/react";
import { FarcasterProvider } from "~/components/farcaster/farcaster.provider";
import { MessagesProvider } from "~/components/messages";
import { WindowsProvider } from "~/components/windows/provider";
import { WindowManager } from "~/components/windows/windows.manager";
import { OnboardingGate } from "~/components/onboarding";
import { env } from "~/env.app";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThirdwebProvider>
      <SessionProvider>
        <OnboardingGate>
          <FarcasterProvider>
            <MessagesProvider>
              <WindowsProvider>
                <SidebarProvider>
                  {env.NEXT_PUBLIC_APP_ENABLED && <SidebarMain />}
                  <SidebarBreakpoints>
                    <SidebarInset>{children}</SidebarInset>
                  </SidebarBreakpoints>
                </SidebarProvider>
                <WindowManager />
              </WindowsProvider>
            </MessagesProvider>
          </FarcasterProvider>
        </OnboardingGate>
      </SessionProvider>
    </ThirdwebProvider>
  );
}
