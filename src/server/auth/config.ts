import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { Base } from "./base";
import { Farcaster } from "./farcaster";
import type { AccountType } from "~/server/db/schema";

// Tauri builds use tauri:// protocol which doesn't support secure cookies
// In dev mode, Tauri connects to localhost which also needs relaxed cookie settings
const isTauriBuild = process.env.TAURI_BUILD === "true";
const isDev = process.env.NODE_ENV === "development";

// Use relaxed cookie settings for Tauri builds OR development mode
// This is safe because CSRF protection still validates the token, just with different cookie attributes
const useRelaxedCookies = isTauriBuild || isDev;

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
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fid = user.fid;
        token.address = user.address;
        token.thirdwebJwt = user.thirdwebJwt;
        token.provider = user.provider;
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          fid: token.fid as number,
          address: token.address as string,
          thirdwebJwt: token.thirdwebJwt as string,
          provider: token.provider as AccountType,
        },
      };
    },
  },
  // Trust the host header in Tauri/dev environments
  trustHost: useRelaxedCookies,
  cookies: useRelaxedCookies
    ? {
        // Tauri/Dev: Use lax cookies without secure flag (tauri:// and localhost don't support HTTPS)
        sessionToken: {
          options: {
            sameSite: "lax",
            httpOnly: false,
            secure: false,
          },
        },
        csrfToken: {
          options: {
            sameSite: "lax",
            httpOnly: true,
            secure: false,
          },
        },
      }
    : {
        // Production Web: Use strict security settings
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
