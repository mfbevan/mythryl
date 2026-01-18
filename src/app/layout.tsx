import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme/theme.provider";
import { cn } from "~/lib/utils";
import { fonts } from "~/components/theme/theme.fonts";
import { Toaster } from "~/components/ui/sonner";
import { ProgressProvider } from "~/components/navigation/progress";
import { createMetadata } from "~/services/metadata.service";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = createMetadata({});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(fonts)} suppressHydrationWarning>
      <body className="bg-sidebar">
        <ProgressProvider>
          <ThemeProvider>
            <TRPCReactProvider>
              <NuqsAdapter>
                {children}
                <Toaster />
              </NuqsAdapter>
            </TRPCReactProvider>
          </ThemeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
