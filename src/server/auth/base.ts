import CredentialsProvider from "next-auth/providers/credentials";
import type { Address, Hex } from "viem";
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
  async authorize(credentials, _request) {
    const address = credentials.address as Address;
    const message = credentials.message as string;
    const signature = credentials.signature as Hex;

    console.log(address, message, signature);
    const client = createPublicClient();
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
        username: user?.username ?? address.toLowerCase(),
        displayName: user?.display_name ?? undefined,
        avatar: user?.pfp_url ?? undefined,
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
