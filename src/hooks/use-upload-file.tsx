"use client";

import { useMutation } from "@tanstack/react-query";

import { type ZodFile } from "~/server/api/schema/file";
import { api } from "~/trpc/react";
import {
  processImage,
  isValidImageFile,
  type ProcessImageOptions,
} from "~/lib/image-processor";

export const useUploadFile = (processImageOptions?: ProcessImageOptions) => {
  const urlMutation = api.files.createUploadUrl.useMutation();
  return useMutation({
    mutationFn: async (file: ZodFile) => {
      let fileToUpload = file as File;

      // Process image if it's an image file and processing options are provided
      if (processImageOptions && isValidImageFile(fileToUpload)) {
        try {
          fileToUpload = await processImage(fileToUpload, processImageOptions);
        } catch (error) {
          console.warn(
            "Image processing failed, uploading original file:",
            error,
          );
          // Continue with original file if processing fails
        }
      }

      const { putUrl, getUrl } = await urlMutation.mutateAsync({
        contentType: fileToUpload.type,
        fileName: fileToUpload.name,
        fileSize: fileToUpload.size,
      });

      await fetch(putUrl, {
        method: "PUT",
        body: fileToUpload,
        headers: {
          "Content-Type": fileToUpload.type,
          "If-None-Match": "*",
        },
      });

      return getUrl;
    },
  });
};

export const useUploadFiles = (processImageOptions?: ProcessImageOptions) => {
  const upload = useUploadFile(processImageOptions);
  const uploadMultipleMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const urls = await Promise.all(
        files.map(async (file) => {
          return await upload.mutateAsync(file);
        }),
      );

      return urls;
    },
  });

  return {
    uploadMultipleMutation,
  };
};
