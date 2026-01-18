"use client";

import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { Button } from "~/components/ui/button";
import { client } from "~/services/thirdweb.service";

export const ConnectToken = () => {
  const wallet = useActiveWallet();
  const onClick = async () => {
    if (!wallet) {
      console.log("No wallet found");
      return;
    }

    const authToken = wallet.getAuthToken?.();

    if (!authToken) {
      console.log("No auth token available");
      return;
    }

    console.log("Auth token:", authToken);

    // Decode JWT payload (middle part)
    const parts = authToken.split(".");
    if (parts.length !== 3) {
      console.log("Invalid JWT format");
      return;
    }

    const payload = parts[1]!;
    const decoded = JSON.parse(atob(payload)) as Record<string, unknown>;
    console.log("Decoded JWT payload:", decoded);
  };

  return (
    <>
      <ConnectButton
        client={client}
        wallets={[
          inAppWallet({
            auth: { options: ["farcaster"] },
          }),
        ]}
      />
      <Button onClick={onClick}>Get Token</Button>
    </>
  );
};
