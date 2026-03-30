import { z } from 'zod';
import { followRemoteHub, sendHubFollow, resolveRemoteActor } from '@commonpub/server';

const bodySchema = z.object({
  actorUri: z.string().url(),
});

export default defineEventHandler(async (event) => {
  requireFeature('federation');
  requireFeature('federateHubs');
  requireAdmin(event);

  const db = useDB();
  const config = useConfig();
  const body = await parseBody(event, bodySchema);

  // Resolve the remote Group actor to get hub metadata
  const actor = await resolveRemoteActor(db, body.actorUri);
  if (!actor) {
    throw createError({ statusCode: 404, statusMessage: 'Could not resolve remote hub actor' });
  }

  if (actor.actorType !== 'Group') {
    throw createError({ statusCode: 400, statusMessage: 'Actor is not a Group (hub)' });
  }

  const domain = new URL(body.actorUri).hostname;
  // Extract hub slug from actor URI: https://domain/hubs/slug -> slug
  const slugMatch = body.actorUri.match(/\/hubs\/([^/]+)$/);
  const remoteSlug = slugMatch?.[1] ?? actor.preferredUsername ?? 'unknown';

  const result = await followRemoteHub(db, body.actorUri, {
    originDomain: domain,
    remoteSlug,
    name: actor.displayName ?? actor.preferredUsername ?? remoteSlug,
    description: actor.summary ?? undefined,
    iconUrl: actor.avatarUrl ?? undefined,
    bannerUrl: actor.bannerUrl ?? undefined,
    remoteMemberCount: actor.followerCount ?? 0,
    url: `https://${domain}/hubs/${remoteSlug}`,
  });

  // Queue outbound Follow activity — delivery worker will send to remote Group actor
  await sendHubFollow(db, body.actorUri, config.instance.domain);

  return { success: true, hubId: result.id, created: result.created };
});
