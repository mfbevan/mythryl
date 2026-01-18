import { protectedProcedure } from "../../trpc";

export const getCurrentUser = protectedProcedure.query(({ ctx }) => {
  return ctx.user;
});
