import CredentialsProvider from "next-auth/providers/credentials";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";

import { login } from "./thirdweb.actions";
import {
  getOrCreateUser,
  getUserAvatar,
} from "../api/routers/users/users.service";
import { getAddress } from "thirdweb";
import { db } from "../db";

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

    const walletAddress = getAddress(verifyParams.payload.address);

    const account = await getOrCreateUser(db)(walletAddress);

    return {
      id: account.id,
      name: account.id,
      image: getUserAvatar(account.id),
    };
  },
});
