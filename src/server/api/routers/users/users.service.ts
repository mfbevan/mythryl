import { type DB } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { type Address } from "thirdweb";

export const getUserById = (db: DB) => async (userId: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) throw new Error("User not found");

  return {
    id: user.id,
    fid: user.fid,
    address: user.address,
    status: user.status,
    displayName: user.id,
    username: user.id,
  };
};

export const getUserAvatar = (userId: string) => {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${userId.toLowerCase()}`;
};

export const getOrCreateUser = (db: DB) => async (address: Address) => {
  const user = await db.query.users.findFirst({
    where: eq(users.address, address),
  });

  if (user) return user;

  const [newUser] = await db.insert(users).values({ address }).returning();
  if (!newUser) throw new Error("Failed to create user");

  return newUser;
};
