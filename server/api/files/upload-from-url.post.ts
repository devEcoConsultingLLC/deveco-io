import { z } from 'zod';
import { createStorageFromEnv, generateStorageKey, isProcessableImage, processImage } from '@commonpub/server';

const schema = z.object({
  url: z.string().url(),
  purpose: z.enum(['content', 'cover', 'avatar', 'banner']).default('content'),
});

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

let storage: ReturnType<typeof createStorageFromEnv> | null = null;
function getStorage(): ReturnType<typeof createStorageFromEnv> {
  if (!storage) storage = createStorageFromEnv();
  return storage;
}

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const { url, purpose } = await parseBody(event, schema);

  // SSRF protection — block private IPs
  const parsed = new URL(url);
  const hostname = parsed.hostname;
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.match(/^172\.(1[6-9]|2\d|3[01])\./) ||
    hostname === '169.254.169.254'
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot fetch from private/local addresses' });
  }

  // Download the remote image
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'devEco.io Image Fetcher' },
    });
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Failed to fetch remote image' });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw createError({ statusCode: 400, statusMessage: `Remote server returned ${response.status}` });
  }

  const contentType = response.headers.get('content-type') || '';
  const mimeType = contentType.split(';')[0]!.trim();
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported image type: ${mimeType}` });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > 10 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: 'Image too large (max 10MB)' });
  }

  const adapter = getStorage();
  const filename = parsed.pathname.split('/').pop() || `import-${Date.now()}`;

  if (isProcessableImage(mimeType)) {
    const processed = await processImage(buffer, filename, purpose, adapter, mimeType);
    return { url: processed.originalUrl };
  }

  const key = generateStorageKey(filename, purpose);
  const publicUrl = await adapter.upload(key, buffer, mimeType);
  return { url: publicUrl };
});
