import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { comments, likes } from '@deveco/db';

export const commentRouter = router({
  byProject: publicProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.comments.findMany({
        where: eq(comments.projectId, input.projectId),
        with: { author: true, replies: { with: { author: true } } },
        orderBy: [desc(comments.createdAt)],
        limit: input.limit,
        offset: input.offset,
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        body: z.string().min(1).max(5000),
        parentId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [comment] = await ctx.db
        .insert(comments)
        .values({
          projectId: input.projectId,
          authorId: ctx.user.id,
          body: input.body,
          parentId: input.parentId,
        })
        .returning();

      return comment;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(comments).where(eq(comments.id, input.id));
      return { success: true };
    }),

  like: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid().optional(),
        commentId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(likes)
        .values({
          userId: ctx.user.id,
          projectId: input.projectId,
          commentId: input.commentId,
        })
        .onConflictDoNothing();

      return { success: true };
    }),
});
