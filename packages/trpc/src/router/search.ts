import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || '';

async function meiliSearch(index: string, query: string, options?: Record<string, unknown>) {
  const res = await fetch(`${MEILISEARCH_HOST}/indexes/${index}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MEILISEARCH_API_KEY}`,
    },
    body: JSON.stringify({ q: query, ...options }),
  });

  if (!res.ok) throw new Error(`Meilisearch error: ${res.statusText}`);
  return res.json();
}

export const searchRouter = router({
  global: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(20).default(10),
      }),
    )
    .query(async ({ input }) => {
      const [projectResults, hardwareResults] = await Promise.all([
        meiliSearch('projects', input.query, { limit: input.limit }),
        meiliSearch('hardware', input.query, { limit: input.limit }),
      ]);

      return {
        projects: projectResults.hits || [],
        hardware: hardwareResults.hits || [],
      };
    }),

  projects: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(200),
        limit: z.number().min(1).max(50).default(20),
        filter: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const results = await meiliSearch('projects', input.query, {
        limit: input.limit,
        filter: input.filter,
      });
      return results;
    }),
});
