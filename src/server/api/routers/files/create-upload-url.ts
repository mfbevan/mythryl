import { v4 } from "uuid";

import {
  getFileUploadUrlRequestSchema,
  getFileUploadUrlResponseSchema,
} from "~/server/api/schema/file";
import { getUploadUrl } from "~/services/s3.service";
import { protectedProcedure } from "~/server/api/trpc";

export const createUploadUrl = protectedProcedure
  .input(getFileUploadUrlRequestSchema)
  .output(getFileUploadUrlResponseSchema)
  .mutation(async ({ input }) => {
    const { contentType, fileName, fileSize } = input;
    const uuid = v4();
    const key = `uploads/${uuid}.${fileName.split(".").pop()}`;

    const { getUrl, putUrl } = await getUploadUrl({
      bucket: "public",
      contentType,
      key,
      contentLength: fileSize,
    });

    return { getUrl, putUrl };
  });
