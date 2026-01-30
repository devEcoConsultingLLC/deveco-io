import type { FastifyPluginAsync } from 'fastify';
import { eq, desc, ilike, and } from 'drizzle-orm';
import { db } from '@deveco/db';
import { hardwareItems } from '@deveco/db';

export const hardwareRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    handler: async (request) => {
      const { limit, offset, category, vendor, search } = request.query as any;
      const conditions = [];

      if (category) conditions.push(eq(hardwareItems.category, category));
      if (vendor) conditions.push(eq(hardwareItems.vendor, vendor));
      if (search) conditions.push(ilike(hardwareItems.name, `%${search}%`));

      const items = await db.query.hardwareItems.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: [desc(hardwareItems.projectCount)],
        limit: limit || 20,
        offset: offset || 0,
      });

      return { data: items };
    },
  });

  app.get('/:slug', {
    handler: async (request, reply) => {
      const { slug } = request.params as { slug: string };
      const item = await db.query.hardwareItems.findFirst({
        where: eq(hardwareItems.slug, slug),
      });

      if (!item) return reply.status(404).send({ error: 'Hardware item not found' });
      return { data: item };
    },
  });
};
