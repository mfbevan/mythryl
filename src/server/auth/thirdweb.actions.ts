"use server";

import type {
  GenerateLoginPayloadParams,
  VerifyLoginPayloadParams,
} from "thirdweb/auth";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { cookies } from "next/headers";
import { getAddress } from "thirdweb";
import { client } from "~/services/thirdweb.service";
import { getBaseUrl } from "~/services/url.service";
import { env } from "~/env.app";

const privateKey = env.THIRDWEB_AUTH_PRIVATE_KEY;

const thirdwebAuth = createAuth({
  domain: getBaseUrl(),
  adminAccount: privateKeyToAccount({ client, privateKey }),
  client,
  login: {
    statement: `Welcome to Farmverse!`,
  },
});

export const getLoginPayload = async (args: GenerateLoginPayloadParams) => {
  return thirdwebAuth.generatePayload(args);
};

export const login = async (payload: VerifyLoginPayloadParams) => {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);

  if (!verifiedPayload.valid) {
    throw new Error("Invalid payload");
  }

  const jwt = await thirdwebAuth.generateJWT({
    payload: verifiedPayload.payload,
  });
  const cookieStore = await cookies();
  cookieStore.set("jwt", jwt, {
    // sameSite: "none",
    // httpOnly: true,
    // secure: true,
  });
};

export const isLoggedIn = async (expectedAddress: string) => {
  const cookieStore = await cookies();

  const jwt = cookieStore.get("jwt");
  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });

  return (
    authResult.valid && getAddress(authResult.parsedJWT.sub) === expectedAddress
  );
};

export const logout = async () => {
  await clearJwt();
};

const clearJwt = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("fc-jwt");
  cookieStore.set("jwt", "", {
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
  cookieStore.set("fc-jwt", "", {
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
};
