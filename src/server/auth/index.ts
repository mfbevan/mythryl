import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";
import { type UserRole } from "../db/schema";
import { redirect } from "next/navigation";
import { getUserById } from "../api/routers/users/users.service";
import { db } from "../db";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };

export const onlyRole = async (roles: UserRole | UserRole[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/");
  }

  const user = await getUserById(db)(session.user.id);

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return redirect("/");
  }
};

export const ifIsAdmin = <T>(
  user: { role: UserRole },
  ifTrue: T,
  ifFalse?: T,
) => (user.role === "admin" ? ifTrue : ifFalse);
