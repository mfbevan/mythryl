"use client";

import { SessionProvider } from "next-auth/react";
import { ThirdwebProvider } from "thirdweb/react";
import { MessagesProvider } from "~/components/messages";
import { WindowsProvider } from "~/components/windows/provider";

export default function WindowLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThirdwebProvider>
      <SessionProvider>
        <MessagesProvider>
          <WindowsProvider>{children}</WindowsProvider>
        </MessagesProvider>
      </SessionProvider>
    </ThirdwebProvider>
  );
}
