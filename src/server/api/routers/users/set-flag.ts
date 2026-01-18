import { z } from "zod";
import { eq } from "drizzle-orm";

import { protectedProcedure } from "../../trpc";
import { users } from "~/server/db/schema";

export const setFlag = protectedProcedure
  .input(z.object({ flag: z.enum(["termsAccepted", "appShared"]) }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(users)
      .set({
        flags: {
          ...ctx.user.flags,
          [input.flag]: true,
        },
      })
      .where(eq(users.id, ctx.user.id));
  });
