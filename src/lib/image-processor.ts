/**
 * Client-side image processing utilities
 * Converts images to 512x512 PNG format using HTML5 Canvas API
 */

export interface ProcessImageOptions {
  /**
   * Target size for the processed image (default: 512)
   * If width and height are provided, this is ignored
   */
  size?: number;
  /**
   * Target width for the processed image
   */
  width?: number;
  /**
   * Target height for the processed image
   */
  height?: number;
  /**
   * Output quality for JPEG images (0-1, default: 0.9)
   * Not applicable for PNG output
   */
  quality?: number;
  /**
   * Output format (default: 'png')
   */
  format?: "png" | "jpeg" | "webp";
  /**
   * Background color for transparent images when converting to JPEG
   * (default: '#ffffff')
   */
  backgroundColor?: string;
}

/**
 * Processes an image file to the specified dimensions and format
 * @param file - The input image file
 * @param options - Processing options
 * @returns Promise that resolves to the processed File
 */
export const processImage = async (
  file: File,
  options: ProcessImageOptions = {},
): Promise<File> => {
  const {
    size = 512,
    width,
    height,
    quality = 0.9,
    format = "png",
    backgroundColor = "#ffffff",
  } = options;

  // Use width/height if provided, otherwise fall back to square size
  const targetWidth = width ?? size;
  const targetHeight = height ?? size;

  return new Promise((resolve, reject) => {
    // Validate input file type
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      try {
        // Clean up object URL
        URL.revokeObjectURL(img.src);

        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calculate scaling to maintain aspect ratio and center the image
        const scale = Math.min(
          targetWidth / img.width,
          targetHeight / img.height,
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (targetWidth - scaledWidth) / 2;
        const offsetY = (targetHeight - scaledHeight) / 2;

        // Fill background for non-transparent formats
        if (format === "jpeg") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // Draw the image scaled and centered
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create image blob"));
              return;
            }

            // Create new file with processed image
            const processedFile = new File(
              [blob],
              generateProcessedFileName(
                file.name,
                format,
                targetWidth,
                targetHeight,
              ),
              {
                type: `image/${format}`,
                lastModified: Date.now(),
              },
            );

            resolve(processedFile);
          },
          `image/${format}`,
          format === "jpeg" ? quality : undefined,
        );
      } catch (error) {
        reject(new Error(`Image processing failed: ${error}`));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };

    // Create object URL and load the image
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
  });
};

/**
 * Generates a filename for the processed image
 * @param originalName - Original filename
 * @param format - Output format
 * @param width - Image width
 * @param height - Image height (optional, defaults to width for square images)
 * @returns Generated filename
 */
const generateProcessedFileName = (
  originalName: string,
  format: string,
  width: number,
  height?: number,
): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const timestamp = Date.now();
  const dimensions =
    height && height !== width ? `${width}x${height}` : `${width}x${width}`;
  return `${nameWithoutExt}_${dimensions}_${timestamp}.${format}`;
};

/**
 * Validates if a file is a supported image type
 * @param file - File to validate
 * @returns boolean indicating if file is a supported image
 */
export const isValidImageFile = (file: File): boolean => {
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
  ];

  return supportedTypes.includes(file.type);
};

/**
 * Gets image dimensions without processing
 * @param file - Image file
 * @returns Promise with image dimensions
 */
export const getImageDimensions = async (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (!isValidImageFile(file)) {
      reject(new Error("File is not a supported image type"));
      return;
    }

    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
};
