import { createTRPCRouter } from "~/server/api/trpc";

import { getToken } from "./get-token";

export const tokensRouter = createTRPCRouter({
  getToken,
});
