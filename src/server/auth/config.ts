import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { Thirdweb } from "./thirdweb";

declare module "next-auth" {
  interface Session {
    user: { fid: number } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [Thirdweb],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        // This pulls the playerId in correctly to attach it to the session
        token.id = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
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
