import { useState } from "react";
import { useSetActiveWallet } from "thirdweb/react";
import { useQuery } from "@tanstack/react-query";
import { base } from "thirdweb/chains";
import { useSession } from "next-auth/react";

import { createBaseWallet } from "./base.wallet";

import { client } from "~/services/thirdweb.service";

export const useBaseWallet = () => {
  const [hasAutoConnected, setHasAutoConnected] = useState(false);
  const setActiveWallet = useSetActiveWallet();
  const session = useSession();

  const isBaseProvider = session.data?.user?.provider === "base";

  const query = useQuery({
    queryKey: ["base-wallet", hasAutoConnected, isBaseProvider, session.status],
    queryFn: async () => {
      if (hasAutoConnected) return null;

      // Only auto-connect if user is authenticated with Base provider
      if (session.status !== "authenticated" || !isBaseProvider) return null;

      const { wallet } = await createBaseWallet();
      const account = await wallet.connect({
        client,
        chain: base,
      });
      void setActiveWallet(wallet);
      setHasAutoConnected(true);

      return {
        wallet,
        account,
      };
    },
  });

  return {
    ...query,
    wallet: query.data?.wallet,
    account: query.data?.account,
  };
};
