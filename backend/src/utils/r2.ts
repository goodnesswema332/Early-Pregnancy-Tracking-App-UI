import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT = process.env.R2_ENDPOINT; // e.g. https://<account>.r2.cloudflarestorage.com
const R2_BUCKET = process.env.R2_BUCKET;

const client = new S3Client({
  region: process.env.AWS_REGION || "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: false,
});

export const generatePresignedUploadUrl = async (
  key: string,
  contentType = "application/octet-stream",
  expiresIn = 900,
) => {
  if (!R2_BUCKET) throw new Error("R2_BUCKET not configured");
  const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, command, { expiresIn });
  return url;
};

export const uploadBuffer = async (key: string, buffer: Buffer, contentType = "application/octet-stream") => {
  if (!R2_BUCKET) throw new Error("R2_BUCKET not configured");
  await client.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buffer, ContentType: contentType }));
  // Return public URL - Cloudflare R2 custom domain or account endpoint expected in env
  if (process.env.R2_PUBLIC_BASE_URL) {
    return `${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }
  return key;
};
