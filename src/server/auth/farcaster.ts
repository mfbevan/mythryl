import CredentialsProvider from "next-auth/providers/credentials";
import {
  createAppClient,
  viemConnector,
  type VerifySignInMessageArgs,
} from "@farcaster/auth-client";
import { optimism } from "thirdweb/chains";
import { getBaseDomain } from "~/services/url.service";
import { getUserAccount } from "../api/routers/users/users.service";
import { rpc } from "~/services/thirdweb.service";

export const Farcaster = CredentialsProvider({
  id: "farcaster",
  name: "Farcaster",
  credentials: {
    message: { label: "Message", type: "text", placeholder: "0x0" },
    signature: { label: "Signature", type: "text", placeholder: "0x0" },
    username: { label: "Username", type: "text", placeholder: "0x0" },
    displayName: { label: "Name", type: "text", placeholder: "0x0" },
    avatar: { label: "Pfp", type: "text", placeholder: "0x0" },
  },
  async authorize(credentials, request) {
    const appClient = createAppClient({
      ethereum: viemConnector({ rpcUrl: rpc(optimism) }),
    });

    const origin = request?.headers.get("host");
    // Normalize domain - remove www. prefix to match client-side
    const domain = (origin ?? getBaseDomain()).replace(/^www\./, "");

    // Validation and debug logging
    if (!domain) {
      console.error("[Farcaster Auth] Missing domain in verification");
      return null;
    }

    const message = credentials.message as string;

    // Extract nonce from the SIWE message - this is the source of truth
    const nonceMatch = /Nonce: ([a-f0-9]+)/i.exec(message);
    const messageNonce = nonceMatch?.[1];

    if (!messageNonce) {
      console.error("[Farcaster Auth] Failed to extract nonce from message");
      return null;
    }

    console.log("[Farcaster Auth] Verification attempt:", {
      origin,
      domain,
      nonce: messageNonce,
      messagePreview: message.slice(0, 200),
    });

    // Verify the SIWE message signature
    // Note: The nonce in the SIWE message provides replay protection
    // NextAuth's CSRF protection is handled separately at the signIn() level
    const payload: VerifySignInMessageArgs = {
      message,
      signature: credentials?.signature as `0x${string}`,
      domain,
      nonce: messageNonce,
      acceptAuthAddress: true,
    };

    const verifyResponse = await appClient.verifySignInMessage(payload);
    const { success, isError, fid } = verifyResponse;

    if (isError || !success) {
      console.error("[Farcaster Auth] Failed to verify", {
        verifyResponse,
        domain,
        nonce: messageNonce,
        message,
        signature: credentials?.signature,
      });
      return null;
    }

    console.log("[Farcaster Auth] Successfully verified", { fid, domain });

    const account = await getUserAccount("farcaster", fid.toString(), {
      username: credentials?.username as string,
      displayName: credentials?.displayName as string,
      avatar: credentials?.avatar as string,
      fid,
    });

    return {
      id: account.userId,
      fid,
      name: account.username,
      image: account.avatar,
    };
  },
});
