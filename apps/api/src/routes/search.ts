import type { FastifyPluginAsync } from 'fastify';

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';

export const searchRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    handler: async (request) => {
      const { q, index, limit } = request.query as { q?: string; index?: string; limit?: number };

      if (!q) return { data: [] };

      const res = await fetch(`${MEILISEARCH_HOST}/indexes/${index || 'projects'}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MEILISEARCH_API_KEY}`,
        },
        body: JSON.stringify({ q, limit: limit || 20 }),
      });

      if (!res.ok) return { data: [], error: 'Search unavailable' };

      const results = await res.json();
      return { data: results.hits || [] };
    },
  });
};
