"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Button } from "~/components/ui/button";
import { homeUrl } from "~/components/navigation/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

    // Auto-redirect after 10 seconds
    const timeout = setTimeout(() => {
      router.push(homeUrl);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [error, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Something Went Wrong</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred. Please try again or return to the home
            page.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <Button onClick={() => reset()} variant="outline" size="sm">
                Try Again
              </Button>
              <Button onClick={() => router.push(homeUrl)} size="sm">
                Go to Home
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Redirecting automatically in 10 seconds...
            </p>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
