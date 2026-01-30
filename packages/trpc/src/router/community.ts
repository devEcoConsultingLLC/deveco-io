import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { communities, communityMembers } from '@deveco/db';

export const communityRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.communities.findMany({
        orderBy: [desc(communities.memberCount)],
        limit: input.limit,
        offset: input.offset,
      });
    }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const community = await ctx.db.query.communities.findFirst({
      where: eq(communities.slug, input.slug),
      with: { members: true, projects: true },
    });
    if (!community) throw new Error('Community not found');
    return community;
  }),

  join: protectedProcedure
    .input(z.object({ communityId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(communityMembers)
        .values({
          communityId: input.communityId,
          userId: ctx.user.id,
          role: 'member',
        })
        .onConflictDoNothing();

      return { success: true };
    }),

  leave: protectedProcedure
    .input(z.object({ communityId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(communityMembers)
        .where(
          eq(communityMembers.communityId, input.communityId) &&
            eq(communityMembers.userId, ctx.user.id),
        );

      return { success: true };
    }),
});
