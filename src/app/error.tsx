"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GamepadDirectional, Home, RefreshCw } from "lucide-react";

import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Route error caught:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4">
      <div className="from-primary/5 via-primary/10 to-primary/5 absolute inset-0 bg-gradient-to-r" />
      <div className="border-border/20 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />
      <div className="border-border/20 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="border-primary/50 bg-primary/10 mb-6 flex items-center gap-2 rounded-full border px-4 py-2">
          <span className="text-primary text-md font-bold tracking-widest uppercase">
            Error
          </span>
        </div>

        <h1 className="mb-4 text-3xl leading-tight font-black text-lime-50 uppercase md:text-5xl">
          Something <span className="text-primary">Went Wrong</span>
        </h1>

        <p className="text-muted-foreground mb-8 max-w-sm text-base">
          This page encountered an error. You can try again or warp back to the
          home page.
        </p>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button onClick={handleRetry} size="lg" className="w-full">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="border-primary/50 bg-primary/10 hover:bg-primary/20 w-full text-lime-50"
          >
            <Home className="size-4" />
            Back to Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 w-full max-w-sm text-left">
            <summary className="text-muted-foreground hover:text-primary cursor-pointer text-sm transition-colors">
              Error Details (Development)
            </summary>
            <pre className="mt-2 overflow-auto rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
