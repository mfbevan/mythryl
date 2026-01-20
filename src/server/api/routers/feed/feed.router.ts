import { createTRPCRouter } from "../../trpc";
import { getFeed } from "./get-feed";
import { getCast } from "./get-cast";
import { getCastConversation } from "./get-cast-conversation";
import { like } from "./like";
import { unlike } from "./unlike";
import { recast } from "./recast";
import { unrecast } from "./unrecast";

export const feedRouter = createTRPCRouter({
  getFeed,
  getCast,
  getCastConversation,
  like,
  unlike,
  recast,
  unrecast,
});
