import { publicProcedure } from "../../trpc";
import { getProfileByUsernameSchema } from "./profiles.schema";
import { getProfileByUsername } from "./profiles.service";

export const getProfileByUsernameProcedure = publicProcedure
  .input(getProfileByUsernameSchema)
  .query(async ({ ctx, input }) => {
    return getProfileByUsername(ctx.db)(input.username);
  });
