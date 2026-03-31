import { contentItems, hubs, hubPosts } from '@commonpub/schema';
import { federateContent, federateHubPost, federateHubActor } from '@commonpub/server';
import { eq, isNull } from 'drizzle-orm';
import { extractDomain } from '../../../utils/inbox';

/**
 * POST /api/admin/federation/refederate
 * Queue all published content, hub actors, and hub posts for federation delivery.
 * Hub actors are announced even if the hub has no posts, so receiving instances
 * can discover the hub exists.
 *
 * Body: { contentId?: string, hubsOnly?: boolean } — if omitted, re-federates ALL
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event);

  const config = useConfig();
  if (!config.features.federation) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const body = await readBody(event);
  const contentId = body?.contentId as string | undefined;
  const hubsOnly = body?.hubsOnly === true;

  const db = useDB();
  const runtimeConfig = useRuntimeConfig();
  const domain = extractDomain((runtimeConfig.public?.siteUrl as string) || `https://${config.instance.domain}`);

  if (contentId) {
    await federateContent(db, contentId, domain);
    return { queued: 1 };
  }

  let contentQueued = 0;
  let hubsQueued = 0;
  let hubPostsQueued = 0;

  // Re-federate published content (unless hubsOnly)
  if (!hubsOnly) {
    const published = await db
      .select({ id: contentItems.id })
      .from(contentItems)
      .where(eq(contentItems.status, 'published'));

    for (const item of published) {
      try {
        await federateContent(db, item.id, domain);
        contentQueued++;
      } catch {
        // Skip items that fail
      }
    }
  }

  // Re-federate hubs: announce each hub's Group actor + all hub posts
  if (config.features.federateHubs) {
    const allHubs = await db
      .select({ id: hubs.id })
      .from(hubs)
      .where(isNull(hubs.deletedAt));

    console.log(`[refederate] Found ${allHubs.length} hubs to federate`);

    for (const hub of allHubs) {
      // Announce the hub's existence (triggers auto-discovery on receivers)
      try {
        await federateHubActor(db, hub.id, domain);
        hubsQueued++;
      } catch (err) {
        console.error(`[refederate] federateHubActor failed for hub ${hub.id}:`, err instanceof Error ? err.message : err);
      }

      // Announce each hub post
      const posts = await db
        .select({ id: hubPosts.id })
        .from(hubPosts)
        .where(eq(hubPosts.hubId, hub.id));

      for (const post of posts) {
        try {
          await federateHubPost(db, post.id, hub.id, domain);
          hubPostsQueued++;
        } catch {
          // Skip posts that fail
        }
      }
    }
  }

  const allHubCount = config.features.federateHubs
    ? (await db.select({ id: hubs.id }).from(hubs).where(isNull(hubs.deletedAt))).length
    : 0;

  return {
    queued: contentQueued + hubsQueued + hubPostsQueued,
    content: contentQueued,
    hubs: hubsQueued,
    hubsFound: allHubCount,
    hubPosts: hubPostsQueued,
  };
});
