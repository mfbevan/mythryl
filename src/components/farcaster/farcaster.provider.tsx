"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { optimism } from "thirdweb/chains";
import { useMemo } from "react";

import { getBaseDomain, getBaseUrl } from "~/services/url.service";
import { rpc } from "~/services/thirdweb.service";

export const FarcasterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const domain = useMemo(() => {
    // Normalize domain - remove www. prefix to match server-side
    return getBaseDomain().replace(/^www\./, "");
  }, []);

  return (
    <AuthKitProvider
      config={{
        domain,
        siweUri: getBaseUrl(),
        rpcUrl: rpc(optimism),
        relay: "https://relay.farcaster.xyz",
      }}
    >
      {children}
    </AuthKitProvider>
  );
};
