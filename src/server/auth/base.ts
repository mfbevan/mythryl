import CredentialsProvider from "next-auth/providers/credentials";
import {
  createAppClient,
  viemConnector,
  type VerifySignInMessageArgs,
} from "@farcaster/auth-client";
import { base, optimism } from "thirdweb/chains";
import { verifyMessage, type Address, type Hex } from "viem";

import { getBaseDomain } from "~/services/url.service";
import { createPublicClient } from "~/services/viem.service";
import { getFarcasterUserByAddress } from "~/services/neynar.service";
import { getOrCreateUserAccount } from "../api/routers/users/users.service";

export const Base = CredentialsProvider({
  id: "base",
  name: "Base Account",
  credentials: {
    address: { label: "Address", type: "text" },
    message: { label: "Message", type: "text", placeholder: "0x0" },
    signature: { label: "Signature", type: "text", placeholder: "0x0" },
  },
  async authorize(credentials, request) {
    const address = credentials.address as Address;
    const message = credentials.message as string;
    const signature = credentials.signature as Hex;

    console.log(address, message, signature);
    const client = createPublicClient(base);
    const isValid = await client
      .verifyMessage({
        address,
        message,
        signature,
      })
      .catch((e) => {
        console.error(e);
        return false;
      });

    if (!isValid) {
      console.error("[Base Auth] Invalid signature");
      return null;
    }

    const user = await getFarcasterUserByAddress(credentials.address as string);
    const fid = user?.fid;

    console.log("[Base Auth] Successfully verified", user?.fid, user?.username);

    const account = await getOrCreateUserAccount(
      "base",
      address.toLowerCase(),
      {
        username: user?.username!,
        displayName: user?.display_name!,
        avatar: user?.pfp_url!,
        fid,
      },
    );

    return {
      id: account.playerId,
      fid,
      name: account.username,
      image: account.avatar,
      provider: "base" as const,
    };
  },
});
