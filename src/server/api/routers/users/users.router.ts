import { createTRPCRouter } from "../../trpc";
import { getCurrentUser } from "./get-current-user";
import { getUser } from "./get-user";
import { searchFarcasterUsers } from "./search-farcaster-users";
import { setFlag } from "./set-flag";

export const usersRouter = createTRPCRouter({
  getUser,
  getCurrentUser,
  setFlag,
  searchFarcasterUsers,
});
