import { publicProcedure } from "../../trpc";
import { getProfilesByFidsSchema } from "./profiles.schema";
import { getProfilesByFids } from "./profiles.service";

export const getProfilesByFidsProcedure = publicProcedure
  .input(getProfilesByFidsSchema)
  .query(async ({ ctx, input }) => {
    return getProfilesByFids(ctx.db)(input.fids);
  });
