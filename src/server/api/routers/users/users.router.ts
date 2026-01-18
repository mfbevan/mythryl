import { createTRPCRouter } from "../../trpc";
import { getCurrentUser } from "./get-current-user";
import { getUser } from "./get-user";
import { searchFarcasterUsers } from "./search-farcaster-users";
import { setFlag } from "./set-flag";
import { syncUser } from "./sync-user";

export const usersRouter = createTRPCRouter({
  getUser,
  getCurrentUser,
  setFlag,
  syncUser,
  searchFarcasterUsers,
});
