import { createTRPCRouter } from "../../trpc";

import { createUploadUrl } from "./create-upload-url";

export const filesRouter = createTRPCRouter({
  createUploadUrl,
});
