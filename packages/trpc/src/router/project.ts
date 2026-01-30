import { z } from 'zod';
import { eq, desc, and, ilike } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { projects, projectVersions } from '@deveco/db';

export const projectRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        featured: z.boolean().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input.status) conditions.push(eq(projects.status, input.status));
      if (input.featured !== undefined) conditions.push(eq(projects.featured, input.featured));
      if (input.search) conditions.push(ilike(projects.title, `%${input.search}%`));

      const items = await ctx.db.query.projects.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        with: { author: true },
        orderBy: [desc(projects.publishedAt)],
        limit: input.limit,
        offset: input.offset,
      });

      return items;
    }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const project = await ctx.db.query.projects.findFirst({
      where: eq(projects.slug, input.slug),
      with: { author: true, versions: true },
    });

    if (!project) throw new Error('Project not found');
    return project;
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        summary: z.string().optional(),
        content: z.any().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        license: z.string().optional(),
        repoUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .insert(projects)
        .values({
          ...input,
          authorId: ctx.user.id,
          status: 'draft',
        })
        .returning();

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        summary: z.string().optional(),
        content: z.any().optional(),
        coverImageUrl: z.string().url().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        license: z.string().optional(),
        repoUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(projects.id, id), eq(projects.authorId, ctx.user.id)))
        .returning();

      return updated;
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [published] = await ctx.db
        .update(projects)
        .set({
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(eq(projects.id, input.id), eq(projects.authorId, ctx.user.id)))
        .returning();

      return published;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projects)
        .where(and(eq(projects.id, input.id), eq(projects.authorId, ctx.user.id)));

      return { success: true };
    }),
});
