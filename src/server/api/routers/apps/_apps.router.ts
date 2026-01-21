import { createTRPCRouter } from "../../trpc";
import { addApp } from "./add-app";
import { getApp } from "./get-app";
import { getUserApps } from "./get-user-apps";
import { listApps } from "./list-apps";
import { removeApp } from "./remove-app";
import { updateNotifications } from "./update-notifications";

export const appsRouter = createTRPCRouter({
  getApp,
  listApps,
  addApp,
  removeApp,
  updateNotifications,
  getUserApps,
});
