import { createTRPCRouter } from "../../trpc";
import { getApp } from "./get-app";

export const appsRouter = createTRPCRouter({
  getApp,
});
