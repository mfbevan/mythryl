import { createTRPCRouter } from "../../trpc";
import { getProfileByFidProcedure } from "./get-profile-by-fid";
import { getProfileByUsernameProcedure } from "./get-profile-by-username";
import { getProfilesByFidsProcedure } from "./get-profiles-by-fids";

export const profilesRouter = createTRPCRouter({
  getByFid: getProfileByFidProcedure,
  getByUsername: getProfileByUsernameProcedure,
  getByFids: getProfilesByFidsProcedure,
});
