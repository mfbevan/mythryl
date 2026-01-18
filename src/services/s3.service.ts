import { PutObjectCommand, S3 as S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const BUCKETS = {
  public: "immutagen-public",
} as const;

type Bucket = keyof typeof BUCKETS;

const defaultCDN = "https://cdn.immutagen.ai";

export const CDN_URL = {
  public: defaultCDN,
} as const;

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const generateUrl = (bucket: Bucket, key: string) => {
  const url = new URL(key, CDN_URL[bucket]);
  return url.toString();
};

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> => {
  await s3Client.putObject({
    Bucket: BUCKETS.public,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  return generateUrl("public", key);
};

export const createImageKey = (key: string) => {
  return `gen/${key}`;
};

export const createUploadKey = (key: string) => {
  return `uploads/${key}`;
};

export const getUploadUrl = async ({
  bucket,
  contentType,
  key,
  contentLength,
}: {
  bucket: Bucket;
  contentType: string;
  key: string;
  contentLength?: number;
}): Promise<{ getUrl: string; putUrl: string }> => {
  const command = new PutObjectCommand({
    Bucket: BUCKETS[bucket],
    Key: key,
    ContentType: contentType,
    // Prevent overwriting existing objects
    IfNoneMatch: "*",
    // Enforce maximum file size
    ...(contentLength && { ContentLength: contentLength }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadUrl = await getSignedUrl(s3Client as any, command as any, {
    expiresIn: 3600,
  });

  return {
    getUrl: generateUrl(bucket, key),
    putUrl: uploadUrl,
  };
};
