import Link from "next/link";
import { GamepadDirectional, Home, Search } from "lucide-react";

import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4">
      <div className="from-primary/5 via-primary/10 to-primary/5 absolute inset-0 bg-gradient-to-r" />
      <div className="border-border/20 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />
      <div className="border-border/20 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="border-primary/50 bg-primary/10 mb-6 flex items-center gap-2 rounded-full border px-4 py-2">
          <span className="text-primary text-md font-bold tracking-widest uppercase">
            404
          </span>
        </div>

        <h1 className="mb-4 text-3xl leading-tight font-black text-lime-50 uppercase md:text-5xl">
          Page <span className="text-primary">Not Found</span>
        </h1>

        <p className="text-muted-foreground mb-8 max-w-sm text-base">
          Looks like you warped to the wrong coordinates. This page doesn&apos;t
          exist in Warptown.
        </p>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <Link href="/" className="w-full">
            <Button size="lg" className="w-full">
              <Home className="size-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/docs" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="border-primary/50 bg-primary/10 hover:bg-primary/20 w-full text-lime-50"
            >
              <Search className="size-4" />
              Browse Docs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
