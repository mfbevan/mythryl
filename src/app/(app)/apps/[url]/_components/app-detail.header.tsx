import { ShieldCheckIcon, ShieldAlertIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import type { RouterOutputs } from "~/trpc/react";

type App = RouterOutputs["apps"]["getApp"];

export type AppDetailHeaderProps = {
  app: App;
};

export const AppDetailHeader = ({ app }: AppDetailHeaderProps) => {
  const { config } = app;

  return (
    <div className="flex flex-1 items-start gap-4">
      <Avatar className="size-16 shrink-0 rounded-xl">
        <AvatarImage src={config.iconUrl} alt={config.name} />
        <AvatarFallback className="rounded-xl text-lg">
          {config.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{config.name}</h1>
          <AppStatusBadge status={app.status} />
        </div>

        {config.subtitle && (
          <p className="text-muted-foreground mt-1">{config.subtitle}</p>
        )}

        <p className="text-muted-foreground mt-1 text-sm">{app.url}</p>
      </div>
    </div>
  );
};

const AppStatusBadge = ({
  status,
}: {
  status: "verified" | "suspicious" | "unverified";
}) => {
  if (status === "verified") {
    return (
      <Badge variant="default" className="gap-1">
        <ShieldCheckIcon className="size-3" />
        Verified
      </Badge>
    );
  }

  if (status === "suspicious") {
    return (
      <Badge variant="destructive" className="gap-1">
        <ShieldAlertIcon className="size-3" />
        Suspicious
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      Unverified
    </Badge>
  );
};
