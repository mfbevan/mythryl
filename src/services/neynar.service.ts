import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { ViemLocalEip712Signer } from "@farcaster/hub-nodejs";
import { mnemonicToAccount } from "viem/accounts";
import { hexToBytes } from "viem";
import type { Address } from "thirdweb";

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
> & {
  pro: boolean;
  custody_address?: Address;
};

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
    custody_address: (user as unknown as { custody_address?: string })
      .custody_address as Address | undefined,
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

export const getFarcasterUserByAddress = async (address: string) => {
  const response = await neynar.fetchBulkUsersByEthOrSolAddress({
    addresses: [address],
  });
  const users = response[address.toLowerCase()];
  const [user] = users ?? [];
  return user;
};

// Signer types
export type SignerStatus =
  | "generated"
  | "pending_approval"
  | "approved"
  | "revoked";

export interface NeynarSigner {
  signer_uuid: string;
  public_key: string;
  status: SignerStatus;
  signer_approval_url?: string;
}

// Create and register a new signer for the app (Neynar managed signer)
export const createSigner = async (): Promise<NeynarSigner> => {
  // Step 1: Create the signer
  const signer = await neynar.createSigner();
  console.log(
    "[Neynar] createSigner response:",
    JSON.stringify(signer, null, 2),
  );

  // Step 2: Sign the key request with developer mnemonic
  const appFid = Number(env.NEYNAR_APP_FID);
  const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

  // Create signer from developer mnemonic
  const account = mnemonicToAccount(env.FARCASTER_DEVELOPER_MNEMONIC);
  const appAccountKey = new ViemLocalEip712Signer(account);

  // Convert public key to bytes for signing
  const publicKeyBytes = hexToBytes(signer.public_key as `0x${string}`);

  // Sign the key request
  const signatureResult = await appAccountKey.signKeyRequest({
    requestFid: BigInt(appFid),
    key: publicKeyBytes,
    deadline: BigInt(deadline),
  });

  if (signatureResult.isErr()) {
    throw new Error(`Failed to sign key request: ${signatureResult.error}`);
  }

  // Convert signature to hex string
  const signature = Buffer.from(signatureResult.value).toString("hex");

  // Step 3: Register the signed key with Neynar sponsorship
  const registered = await neynar.registerSignedKey({
    signerUuid: signer.signer_uuid,
    appFid,
    deadline,
    signature: `0x${signature}`,
    sponsor: { sponsored_by_neynar: true },
  });

  console.log(
    "[Neynar] registerSignedKey response:",
    JSON.stringify(registered, null, 2),
  );

  return {
    signer_uuid: registered.signer_uuid,
    public_key: registered.public_key,
    status: registered.status as SignerStatus,
    signer_approval_url: registered.signer_approval_url,
  };
};

// Look up signer status
export const lookupSigner = async (
  signerUuid: string,
): Promise<{ status: SignerStatus; fid?: number; signer_approval_url?: string }> => {
  const signer = await neynar.lookupSigner({ signerUuid });
  console.log("[Neynar] lookupSigner response:", JSON.stringify(signer, null, 2));
  return {
    status: signer.status as SignerStatus,
    fid: signer.fid,
    signer_approval_url: signer.signer_approval_url,
  };
};
