import { auth } from "~/server/auth";

/**
 * Thirdweb Auth Endpoint
 *
 * This endpoint is called by Thirdweb to verify user identity for in-app wallet creation.
 * The request includes the NextAuth session cookie, so we can verify the authenticated user server-side.
 *
 * Thirdweb Dashboard Configuration:
 * - Enable custom authentication for in-app wallets
 * - Set auth endpoint URL to: https://yourdomain.com/api/auth/thirdweb
 */
export const POST = async () => {
  const session = await auth();

  if (!session?.user?.fid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return FID for deterministic wallet generation
  // Security: session cookie proves the request came from an authenticated browser
  return Response.json({ userId: String(session.user.fid) });
};
