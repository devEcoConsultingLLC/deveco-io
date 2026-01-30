import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const s3 = new S3Client({
    endpoint: config.s3Endpoint,
    region: 'us-east-1',
    credentials: {
      accessKeyId: config.s3AccessKey,
      secretAccessKey: config.s3SecretKey,
    },
    forcePathStyle: true,
  });

  const key = `uploads/${Date.now()}-${body.filename}`;

  const command = new PutObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
    ContentType: body.mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  const publicUrl = `${config.s3Endpoint}/${config.s3Bucket}/${key}`;

  return { uploadUrl, publicUrl, key };
});
