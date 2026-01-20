import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { Base } from "./base";
import { Farcaster } from "./farcaster";
import type { AccountType } from "~/server/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      fid: number;
      address: string; // Embedded wallet address
      thirdwebJwt: string; // Reusable JWT for API calls
      provider: AccountType; // Auth provider used (farcaster | base)
    } & DefaultSession["user"];
  }
  interface User {
    fid?: number;
    address?: string;
    thirdwebJwt?: string;
    provider?: AccountType;
  }
  interface JWT {
    id: string;
    fid: number;
    address: string;
    thirdwebJwt: string;
    provider: AccountType;
  }
}

export const authConfig = {
  providers: [Farcaster, Base],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.fid = user.fid!;
        token.address = user.address!;
        token.thirdwebJwt = user.thirdwebJwt!;
        token.provider = user.provider!;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          fid: token.fid,
          address: token.address,
          thirdwebJwt: token.thirdwebJwt,
          provider: token.provider,
        },
      };
    },
  },
  cookies: {
    sessionToken: {
      options: {
        sameSite: "none",
        httpOnly: false,
        secure: true,
      },
    },
    csrfToken: {
      options: {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      },
    },
  },
} satisfies NextAuthConfig;
