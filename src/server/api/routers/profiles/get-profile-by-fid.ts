import { publicProcedure } from "../../trpc";
import { getProfileByFidSchema } from "./profiles.schema";
import { getProfileByFid } from "./profiles.service";

export const getProfileByFidProcedure = publicProcedure
  .input(getProfileByFidSchema)
  .query(async ({ ctx, input }) => {
    return getProfileByFid(ctx.db)(input.fid);
  });
