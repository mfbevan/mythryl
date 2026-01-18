"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";
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

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(homeUrl);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-col items-center gap-2">
            <Button onClick={() => router.push(homeUrl)} size="sm">
              Go to Home
            </Button>
            <p className="text-muted-foreground text-xs">
              Redirecting automatically in 5 seconds...
            </p>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
