import type { FastifyPluginAsync } from 'fastify';
import { eq, desc, ilike, and } from 'drizzle-orm';
import { db } from '@deveco/db';
import { projects } from '@deveco/db';

export const projectRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
          search: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'published', 'archived'] },
          featured: { type: 'boolean' },
        },
      },
    },
    handler: async (request) => {
      const { limit, offset, search, status, featured } = request.query as any;
      const conditions = [eq(projects.status, 'published')];

      if (status) conditions.push(eq(projects.status, status));
      if (featured !== undefined) conditions.push(eq(projects.featured, featured));
      if (search) conditions.push(ilike(projects.title, `%${search}%`));

      const items = await db.query.projects.findMany({
        where: and(...conditions),
        with: { author: true },
        orderBy: [desc(projects.publishedAt)],
        limit: limit || 20,
        offset: offset || 0,
      });

      return { data: items, meta: { limit, offset } };
    },
  });

  app.get('/:slug', {
    schema: {
      params: {
        type: 'object',
        properties: { slug: { type: 'string' } },
        required: ['slug'],
      },
    },
    handler: async (request, reply) => {
      const { slug } = request.params as { slug: string };
      const project = await db.query.projects.findFirst({
        where: eq(projects.slug, slug),
        with: { author: true },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      return { data: project };
    },
  });
};
