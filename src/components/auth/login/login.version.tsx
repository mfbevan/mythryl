import { buildVersion } from "~/services/versions.service";

export const LoginVersion = () => {
  return (
    <div className="text-muted-foreground fixed right-0 bottom-0 p-4 text-xs">
      {buildVersion}
    </div>
  );
};
