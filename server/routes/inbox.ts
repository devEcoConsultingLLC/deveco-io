import { processInboxActivity, verifyHttpSignature, resolveActor } from '@commonpub/protocol';
import { createInboxHandlers } from '@commonpub/server';

/** Extract keyId from the Signature header to resolve the sender's public key */
function extractKeyId(signatureHeader: string): string | null {
  const match = signatureHeader.match(/keyId="([^"]+)"/);
  return match ? match[1] : null;
}

export default defineEventHandler(async (event) => {
  // Gate on federation feature flag
  const config = useConfig();
  if (!config.features.federation) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const method = getMethod(event);
  if (method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  // Verify HTTP Signature
  const signatureHeader = getHeader(event, 'signature');
  if (!signatureHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Missing HTTP Signature' });
  }

  const keyId = extractKeyId(signatureHeader);
  if (!keyId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Signature header: missing keyId' });
  }

  const actorUri = keyId.replace(/#.*$/, '');
  const actor = await resolveActor(actorUri, fetch);
  if (!actor?.publicKey?.publicKeyPem) {
    throw createError({ statusCode: 401, statusMessage: 'Could not resolve actor public key' });
  }

  const request = toWebRequest(event);
  const signatureValid = await verifyHttpSignature(request, actor.publicKey.publicKeyPem);
  if (!signatureValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid HTTP Signature' });
  }

  const body = await readBody(event);

  // Create handlers wired to DB operations
  const db = useDB();
  const runtimeConfig = useRuntimeConfig();
  const domain = (runtimeConfig.public?.siteUrl as string)?.replace(/^https?:\/\//, '') || config.instance.domain;
  const callbacks = createInboxHandlers({ db, domain });

  try {
    const result = await processInboxActivity(body, callbacks);
    if (!result.success) {
      throw createError({ statusCode: 400, statusMessage: result.error ?? 'Invalid activity' });
    }
    return { status: 'accepted' };
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode) throw err;
    console.error('[shared-inbox]', err);
    throw createError({ statusCode: 400, statusMessage: 'Invalid activity' });
  }
});
