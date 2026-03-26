import { buildHubGroupActor } from '@commonpub/server';

/**
 * Hub Group actor endpoint. Returns AP Group JSON-LD for federation.
 * Content-negotiated: AP clients get JSON-LD, browsers redirect to hub page.
 */
export default defineEventHandler(async (event) => {
  const config = useConfig();
  if (!config.features.federation) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

  const accept = getRequestHeader(event, 'accept') ?? '';
  const isAPRequest =
    accept.includes('application/activity+json') ||
    accept.includes('application/ld+json');

  if (!isAPRequest) {
    return sendRedirect(event, `/hubs/${slug}`, 302);
  }

  const db = useDB();
  const actor = await buildHubGroupActor(db, slug, config.instance.domain);
  if (!actor) {
    throw createError({ statusCode: 404, statusMessage: 'Hub not found' });
  }

  setResponseHeader(event, 'content-type', 'application/activity+json');
  return actor;
});
