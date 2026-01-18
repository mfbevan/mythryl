import CredentialsProvider from "next-auth/providers/credentials";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";

import { login } from "./thirdweb.actions";

import { getUserAccount } from "../api/routers/users/users.service";

export const Thirdweb = CredentialsProvider({
  id: "thirdweb",
  name: "Thirdweb",
  credentials: {
    payload: { label: "Payload", type: "text" },
  },
  async authorize(credentials) {
    if (!credentials?.payload) {
      return null;
    }

    const verifyParams = JSON.parse(
      credentials.payload as string,
    ) as VerifyLoginPayloadParams;

    await login(verifyParams);

    const walletAddress = verifyParams.payload.address;

    const account = await getUserAccount("wallet", walletAddress, {
      username: walletAddress.slice(0, 8),
      displayName: walletAddress.slice(0, 8),
      avatar: undefined,
    });

    return {
      id: account.userId,
      name: account.username,
      image: account.avatar,
    };
  },
});
