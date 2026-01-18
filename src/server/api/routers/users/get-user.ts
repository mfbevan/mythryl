import z from "zod";
import { publicProcedure } from "../../trpc";
import { getUserById } from "./users.service";

export const getUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    return getUserById(ctx.db)(input.userId);
  });
