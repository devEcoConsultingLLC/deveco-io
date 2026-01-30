import { z } from 'zod';
import { eq, ilike, and, desc } from 'drizzle-orm';
import { router, publicProcedure } from '../trpc';
import { hardwareItems } from '@deveco/db';

export const hardwareRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        vendor: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input.category) conditions.push(eq(hardwareItems.category, input.category));
      if (input.vendor) conditions.push(eq(hardwareItems.vendor, input.vendor));
      if (input.search) conditions.push(ilike(hardwareItems.name, `%${input.search}%`));

      return ctx.db.query.hardwareItems.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        orderBy: [desc(hardwareItems.projectCount)],
        limit: input.limit,
        offset: input.offset,
      });
    }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const item = await ctx.db.query.hardwareItems.findFirst({
      where: eq(hardwareItems.slug, input.slug),
    });
    if (!item) throw new Error('Hardware item not found');
    return item;
  }),
});
