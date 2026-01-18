import { z } from "zod";
import { eq } from "drizzle-orm";

import { protectedProcedure } from "../../trpc";
import { users } from "~/server/db/schema";

export const setFlag = protectedProcedure
  .input(z.object({ flag: z.enum(["termsAccepted", "appShared"]) }))
  .mutation(async ({ ctx, input }) => {
    // TODO: implement
    await ctx.db.update(users).set({}).where(eq(users.id, ctx.user.id));
  });
