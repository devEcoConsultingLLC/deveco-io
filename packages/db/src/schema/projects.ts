import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const projectStatusEnum = pgEnum('project_status', ['draft', 'published', 'archived']);
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced']);

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary'),
  content: jsonb('content'),
  coverImageUrl: text('cover_image_url'),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: projectStatusEnum('status').default('draft').notNull(),
  difficulty: difficultyEnum('difficulty'),
  license: varchar('license', { length: 64 }),
  repoUrl: text('repo_url'),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  featured: boolean('featured').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const projectVersions = pgTable('project_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  version: varchar('version', { length: 32 }).notNull(),
  content: jsonb('content').notNull(),
  changelog: text('changelog'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  author: one(users, { fields: [projects.authorId], references: [users.id] }),
  versions: many(projectVersions),
}));

export const projectVersionsRelations = relations(projectVersions, ({ one }) => ({
  project: one(projects, { fields: [projectVersions.projectId], references: [projects.id] }),
}));
