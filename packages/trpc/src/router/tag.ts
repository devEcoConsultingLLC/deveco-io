import { z } from 'zod';
import { eq, ilike, desc } from 'drizzle-orm';
import { router, publicProcedure } from '../trpc';
import { tags } from '@deveco/db';

export const tagRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.enum(['platform', 'language', 'framework', 'topic']).optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tags.findMany({
        where: input.category
          ? eq(tags.category, input.category)
          : input.search
            ? ilike(tags.name, `%${input.search}%`)
            : undefined,
        orderBy: [desc(tags.usageCount)],
        limit: input.limit,
      });
    }),

  trending: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tags.findMany({
        orderBy: [desc(tags.usageCount)],
        limit: input.limit,
      });
    }),
});
