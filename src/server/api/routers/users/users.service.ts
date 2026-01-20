import { and, eq } from "drizzle-orm";

import { db, type DB } from "~/server/db";
import { userAccounts, users, type AccountType } from "~/server/db/schema";
import { getLiteFarcasterUser } from "~/services/neynar.service";

export const getCurrentUserById = (db: DB) => async (userId: string) => {
  const playerWithAccounts = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { userAccounts: true },
  });

  if (!playerWithAccounts) throw new Error("User not found");

  const { userAccounts, ...player } = playerWithAccounts;

  const [userAccount] = userAccounts ?? [];

  if (!userAccount) throw new Error("User Account not found");

  return {
    id: player.id,
    fid: player.fid,
    accountType: userAccount.accountType,
    accountId: userAccount.accountId,
    username: userAccount.username,
    displayName: userAccount.displayName,
    avatar: userAccount.avatar,
    flags: player.flags,
  };
};

export const getUserById = (db: DB) => async (userId: string) => {
  const playerWithAccounts = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { userAccounts: true },
  });

  if (!playerWithAccounts) throw new Error("User not found");

  const { userAccounts: accounts, ...player } = playerWithAccounts;
  const [userAccount] = accounts ?? [];

  if (!userAccount) throw new Error("User Account not found");

  return {
    id: player.id,
    fid: player.fid,
    accountType: userAccount.accountType,
    accountId: userAccount.accountId,
    username: userAccount.username,
    displayName: userAccount.displayName,
    avatar: userAccount.avatar,
  };
};

export const getOrCreateUserAccount = async (
  accountType: AccountType,
  accountId: string,
  newAccount?: {
    username: string;
    displayName?: string;
    avatar?: string;
    fid?: number;
  },
) => {
  const [account] = await db
    .select()
    .from(userAccounts)
    .where(
      and(
        eq(userAccounts.accountType, accountType),
        eq(userAccounts.accountId, accountId),
      ),
    )
    .limit(1);

  if (account) {
    return account;
  }

  const { player, neynar } = await createNewUser(newAccount?.fid);

  const [createdAccount] = await db
    .insert(userAccounts)
    .values({
      playerId: player.id,
      accountType,
      accountId,
      username: neynar?.username ?? newAccount?.username ?? accountId,
      displayName:
        neynar?.display_name ??
        newAccount?.displayName ??
        newAccount?.username ??
        accountId,
      avatar: neynar?.pfp_url ?? newAccount?.avatar ?? getUserAvatar(accountId),
    })
    .returning();

  if (!createdAccount) throw new Error("Failed to create account");

  return createdAccount;
};

/**
 * Create a new player, else link the player account if this FID has already been created
 */
const createNewUser = async (fid?: number) => {
  const existingPlayerByFid = fid
    ? await db.query.users.findFirst({
        where: eq(users.fid, fid),
      })
    : null;

  const neynar = fid ? await getLiteFarcasterUser(fid) : null;

  if (existingPlayerByFid) return { player: existingPlayerByFid, neynar };

  const [player] = await db.insert(users).values({ fid, neynar }).returning();

  if (!player) throw new Error("Failed to create user");

  return { player, neynar };
};

export const getUserAvatar = (userId: string) => {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${userId.toLowerCase()}`;
};
