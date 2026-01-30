import type { FastifyPluginAsync } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import { db } from '@deveco/db';
import { communities } from '@deveco/db';

export const communityRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    handler: async (request) => {
      const { limit, offset } = request.query as any;
      const items = await db.query.communities.findMany({
        orderBy: [desc(communities.memberCount)],
        limit: limit || 20,
        offset: offset || 0,
      });
      return { data: items };
    },
  });

  app.get('/:slug', {
    handler: async (request, reply) => {
      const { slug } = request.params as { slug: string };
      const community = await db.query.communities.findFirst({
        where: eq(communities.slug, slug),
      });
      if (!community) return reply.status(404).send({ error: 'Community not found' });
      return { data: community };
    },
  });
};
