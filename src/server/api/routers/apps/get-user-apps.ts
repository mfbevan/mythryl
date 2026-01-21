import { protectedProcedure } from "../../trpc";
import { getUserMiniapps } from "./apps.service";

export const getUserApps = protectedProcedure.query(async ({ ctx }) => {
  return getUserMiniapps(ctx.db)(ctx.user.id);
});
