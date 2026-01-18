import { viemAdapter } from "thirdweb/adapters/viem";
import type { PublicClient } from "viem";

import { activeChain, client } from "./thirdweb.service";

export const createPublicClient = () => {
  return viemAdapter.publicClient.toViem({
    chain: activeChain,
    client,
  }) as PublicClient;
};
