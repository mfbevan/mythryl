import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

export const AppDetailNotFound = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <p className="text-muted-foreground">App not found</p>
    <Button variant="outline" asChild>
      <Link href="/apps">
        <ArrowLeftIcon className="size-4" />
        Back to Apps
      </Link>
    </Button>
  </div>
);
