import { pgTable, uuid, text, timestamp, integer, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { users } from './users';

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  body: text('body').notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('likes_user_project').on(t.userId, t.projectId),
    unique('likes_user_comment').on(t.userId, t.commentId),
  ],
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  project: one(projects, { fields: [comments.projectId], references: [projects.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'thread',
  }),
  replies: many(comments, { relationName: 'thread' }),
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  project: one(projects, { fields: [likes.projectId], references: [projects.id] }),
  comment: one(comments, { fields: [likes.commentId], references: [comments.id] }),
}));
