import { neynar } from "~/services/neynar.service";
import { protectedProcedure } from "../../trpc";
import z from "zod";

export const searchFarcasterUsers = protectedProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ ctx, input }) => {
    const users = await neynar.searchUser({
      q: input.query,
      viewerFid: ctx.user.fid ?? undefined,
    });
    return users;
  });
