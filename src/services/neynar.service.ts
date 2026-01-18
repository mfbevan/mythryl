import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

import { env } from "~/env.app";

const config = new Configuration({
  apiKey: env.NEYNAR_API_KEY,
});

export const neynar = new NeynarAPIClient(config);

export type FarcasterUser = Awaited<
  ReturnType<typeof neynar.fetchBulkUsers>
>["users"][number];

export type LiteFarcasterUser = Pick<
  FarcasterUser,
  | "fid"
  | "username"
  | "display_name"
  | "pfp_url"
  | "auth_addresses"
  | "verified_accounts"
  | "score"
  | "profile"
> & { pro: boolean };

export const getLiteFarcasterUser = async (
  fid: number,
): Promise<LiteFarcasterUser> => {
  const { users } = await neynar.fetchBulkUsers({ fids: [fid] });
  const [user] = users;
  if (!user) throw new Error("Farcaster user not found");

  return {
    fid: user.fid,
    username: user.username,
    display_name: user.display_name,
    pfp_url: user.pfp_url,
    auth_addresses: user.auth_addresses,
    verified_accounts: user.verified_accounts,
    score: user.score,
    profile: user.profile,
    pro: user.pro?.status === "subscribed",
  };
};

export const isFollowingUser = async (follower: number, following: number) => {
  const { users } = await neynar.fetchBulkUsers({
    fids: [following],
    viewerFid: follower,
  });
  const [user] = users;
  if (!user) return false;
  return user?.viewer_context?.following === true;
};
