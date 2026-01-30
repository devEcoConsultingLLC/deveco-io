import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { users, follows } from '@deveco/db';

export const userRouter = router({
  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
      });

      if (!user) throw new Error('User not found');
      return user;
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().max(128).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updated;
    }),

  follow: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(follows)
        .values({
          followerId: ctx.user.id,
          followingId: input.userId,
        })
        .onConflictDoNothing();

      return { success: true };
    }),

  unfollow: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(follows)
        .where(
          eq(follows.followerId, ctx.user.id) && eq(follows.followingId, input.userId),
        );

      return { success: true };
    }),
});
