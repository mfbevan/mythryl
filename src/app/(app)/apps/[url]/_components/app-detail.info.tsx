import { Badge } from "~/components/ui/badge";
import type { RouterOutputs } from "~/trpc/react";

type App = RouterOutputs["apps"]["getApp"];

export type AppDetailInfoProps = {
  app: App;
};

export const AppDetailInfo = ({ app }: AppDetailInfoProps) => {
  const { config } = app;

  return (
    <>
      {config.heroImageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={config.heroImageUrl}
            alt={`${config.name} hero`}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      )}

      {config.description && (
        <div>
          <h2 className="mb-2 font-semibold">About</h2>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
      )}

      {config.tags && config.tags.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-2 font-semibold">Details</h2>
        <div className="divide-y rounded-lg border">
          {config.primaryCategory && (
            <DetailRow label="Category" value={config.primaryCategory} />
          )}
          {"ownerFid" in app && app.ownerFid && (
            <DetailRow label="Owner FID" value={String(app.ownerFid)} />
          )}
          {config.version && (
            <DetailRow label="Version" value={config.version} />
          )}
        </div>
      </div>
    </>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
