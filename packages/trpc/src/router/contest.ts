import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { contests, contestEntries } from '@deveco/db';

export const contestRouter = router({
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(['upcoming', 'active', 'judging', 'ended']).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.contests.findMany({
        where: input.status ? eq(contests.status, input.status) : undefined,
        orderBy: [desc(contests.startsAt)],
        limit: input.limit,
        offset: input.offset,
      });
    }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const contest = await ctx.db.query.contests.findFirst({
      where: eq(contests.slug, input.slug),
      with: { entries: { with: { project: true, user: true } } },
    });
    if (!contest) throw new Error('Contest not found');
    return contest;
  }),

  submitEntry: protectedProcedure
    .input(
      z.object({
        contestId: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [entry] = await ctx.db
        .insert(contestEntries)
        .values({
          contestId: input.contestId,
          projectId: input.projectId,
          userId: ctx.user.id,
        })
        .returning();

      return entry;
    }),
});
