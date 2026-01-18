"use client";

import { useUploadFile } from "./use-upload-file";

import { type ProcessImageOptions } from "~/lib/image-processor";

/**
 * Hook specifically for uploading images with automatic processing
 * Defaults to 512x512 PNG format which is ideal for icons and avatars
 */
export const useImageUpload = (options?: ProcessImageOptions) => {
  const defaultOptions: ProcessImageOptions = {
    size: 512,
    format: "png",
    ...options,
  };

  return useUploadFile(defaultOptions);
};

/**
 * Hook for uploading avatar/profile images
 * Uses smaller 256x256 size for better performance
 */
export const useAvatarUpload = () => {
  return useImageUpload({
    size: 256,
    format: "png",
  });
};

/**
 * Hook for uploading icon images
 * Uses standard 512x512 size for crisp display
 */
export const useIconUpload = () => {
  return useImageUpload({
    size: 512,
    format: "png",
  });
};

/**
 * Hook for uploading banner/cover images
 * Uses larger size and JPEG format for better file size
 */
export const useBannerUpload = () => {
  return useImageUpload({
    size: 1200,
    format: "jpeg",
    quality: 0.85,
  });
};

/**
 * Hook for uploading embed images
 * Uses 600x400 dimensions for frame embeds
 */
export const useEmbedImageUpload = () => {
  return useImageUpload({
    width: 600,
    height: 400,
    format: "png",
  });
};
