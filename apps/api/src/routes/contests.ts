import type { FastifyPluginAsync } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import { db } from '@deveco/db';
import { contests } from '@deveco/db';

export const contestRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    handler: async (request) => {
      const { status, limit, offset } = request.query as any;
      const items = await db.query.contests.findMany({
        where: status ? eq(contests.status, status) : undefined,
        orderBy: [desc(contests.startsAt)],
        limit: limit || 20,
        offset: offset || 0,
      });
      return { data: items };
    },
  });

  app.get('/:slug', {
    handler: async (request, reply) => {
      const { slug } = request.params as { slug: string };
      const contest = await db.query.contests.findFirst({
        where: eq(contests.slug, slug),
        with: { entries: { with: { project: true, user: true } } },
      });
      if (!contest) return reply.status(404).send({ error: 'Contest not found' });
      return { data: contest };
    },
  });
};
