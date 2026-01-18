import { TRPCError } from "@trpc/server";

import { createMiddleware } from "./trpc";

import { headers } from "next/headers";
import { getAddress, keccak256, type Address } from "thirdweb";
import type { User, UserRole } from "../db/schema";

export const walletMiddleware = createMiddleware(async ({ ctx, next }) => {
  const _headers = await headers();
  const addressHeader = _headers.get("x-user-address");

  if (!addressHeader) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Address not found",
    });
  }

  const kua = _headers.get("x-kua");
  const hashed = keccak256(getAddress(addressHeader));
  if (kua !== hashed) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Address spoofing detected",
    });
  }

  return next({
    ctx: {
      ...ctx,
      address: addressHeader as Address,
    },
  });
});

export const roleMiddleware = (roles: UserRole | UserRole[]) =>
  createMiddleware(async ({ ctx, next }) => {
    const user = "user" in ctx ? (ctx.user as User) : null;

    if (!user?.role || !roles.includes(user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Insufficient permissions for this action",
      });
    }

    return next();
  });

export const onlyCreator = roleMiddleware("creator");
export const onlyAdmin = roleMiddleware("admin");
export const onlyAdminCreator = roleMiddleware(["admin", "creator"]);
