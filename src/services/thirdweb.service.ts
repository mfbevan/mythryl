import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { generateAccount, privateKeyToAccount } from "thirdweb/wallets";

import { env } from "~/env.app";
import { resolveChain, type RawChain } from "./chains.service";

export const client = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export const readonlySigner = () => generateAccount({ client });

export const activeChain = base;

export const rpc = (chain: RawChain) => {
  const _chain = resolveChain(chain);

  return `https://${_chain.id}.rpc.thirdweb.com/${env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`;
};
