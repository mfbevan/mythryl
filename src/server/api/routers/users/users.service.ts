import { db, type DB } from "~/server/db";
import { userAccounts, users, type AccountType } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { getLiteFarcasterUser } from "~/services/neynar.service";

export const getUserById = (db: DB) => async (userId: string) => {
  const userWithAccounts = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { userAccounts: true },
  });

  if (!userWithAccounts) throw new Error("User not found");

  const { userAccounts, ...user } = userWithAccounts;

  if (!userAccounts) throw new Error("User Account not found");

  return {
    id: user.id,
    fid: user.fid,
    accountId: userAccounts.accountId,
    username: userAccounts.username,
    displayName: userAccounts.displayName,
    avatar: userAccounts.avatar,
    flags: user.flags,
    role: user.role,
  };
};

export const getUserAccount = async (
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

  const fid = newAccount?.fid;
  const neynar = fid ? await getLiteFarcasterUser(fid) : null;

  const [user] = await db.insert(users).values({ fid, neynar }).returning();

  if (!user) throw new Error("Failed to create users");

  const [createdAccount] = await db
    .insert(userAccounts)
    .values({
      userId: user.id,
      accountType,
      accountId,
      username: neynar?.username ?? accountId,
      displayName: neynar?.display_name ?? accountId,
      avatar: neynar?.pfp_url ?? getUserAvatar(accountId),
    })
    .returning();

  if (!createdAccount) throw new Error("Failed to create account");

  return createdAccount;
};

export const getUserAvatar = (userId: string) => {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${userId.toLowerCase()}`;
};
