const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const path = require("path");

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const buildObjectKey = (prefix, originalName = "") => {
  const ext = path.extname(originalName);
  const id = crypto.randomUUID();
  return `${prefix}/${Date.now()}-${id}${ext}`;
};

const buildObjectUrl = (bucket, region, key) => {
  const safeKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `https://${bucket}.s3.${region}.amazonaws.com/${safeKey}`;
};

const uploadToS3 = async ({ buffer, contentType, key }) => {
  const bucket = process.env.BUCKET_NAME;
  const region = process.env.BUCKET_REGION;

  if (!bucket || !region) {
    throw new Error("Missing S3 configuration in environment variables.");
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return {
    key,
    url: buildObjectUrl(bucket, region, key),
  };
};

const deleteFromS3 = async (key) => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket || !key) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
};

const signObjectUrl = async (key, expiresIn = 3600) => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket || !key) return null;

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn },
  );
};

const signUrlForPath = async (pathValue, expiresIn = 3600) => {
  if (!pathValue || typeof pathValue !== "string") return null;
  const key = pathValue.startsWith("http")
    ? getKeyFromUrl(pathValue)
    : pathValue;

  if (!key) return null;
  return signObjectUrl(key, expiresIn);
};

const getKeyFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch (error) {
    return null;
  }
};

module.exports = {
  buildObjectKey,
  uploadToS3,
  deleteFromS3,
  getKeyFromUrl,
  signUrlForPath,
};
