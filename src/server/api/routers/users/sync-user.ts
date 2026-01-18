import { getLiteFarcasterUser } from "~/services/neynar.service";
import { protectedProcedure } from "../../trpc";
import { userAccounts, users } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const syncUser = protectedProcedure.mutation(async ({ ctx }) => {
  const fid = ctx.user.fid;
  if (!fid) throw new Error("FID is required to sync");

  const neynar = await getLiteFarcasterUser(fid);

  await ctx.db.batch([
    ctx.db
      .update(userAccounts)
      .set({
        username: neynar.username,
        displayName: neynar.display_name,
        avatar: neynar.pfp_url,
      })
      .where(
        and(
          eq(userAccounts.userId, ctx.user.id),
          eq(userAccounts.accountType, "farcaster"),
        ),
      ),
    ctx.db.update(users).set({ neynar }).where(eq(users.id, ctx.user.id)),
  ]);
});
