import { z } from "zod";

export const fileSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  lastModified: z.number(),
});
export type ZodFile = z.infer<typeof fileSchema>;

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const getFileUploadUrlRequestSchema = z.object({
  fileName: z.string(),
  contentType: z
    .string()
    .refine(
      (type) => ALLOWED_IMAGE_TYPES.includes(type as AllowedImageType),
      "Content type must be a valid image format (PNG, JPEG, or WebP)",
    ),
  fileSize: z
    .number()
    .max(
      MAX_FILE_SIZE,
      `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    ),
});
export type GetFileUploadUrlRequest = z.infer<
  typeof getFileUploadUrlRequestSchema
>;
export const getFileUploadUrlResponseSchema = z.object({
  getUrl: z.string(),
  putUrl: z.string(),
});
export type GetFileUploadUrlResponse = z.infer<
  typeof getFileUploadUrlResponseSchema
>;
