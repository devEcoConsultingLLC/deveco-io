import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { users } from './users';

export const contestStatusEnum = pgEnum('contest_status', [
  'upcoming',
  'active',
  'judging',
  'ended',
]);

export const contests = pgTable('contests', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  rules: text('rules'),
  coverImageUrl: text('cover_image_url'),
  sponsorName: varchar('sponsor_name', { length: 128 }),
  sponsorLogoUrl: text('sponsor_logo_url'),
  prizeDescription: text('prize_description'),
  prizeValueUsd: numeric('prize_value_usd', { precision: 10, scale: 2 }),
  status: contestStatusEnum('status').default('upcoming').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contestEntries = pgTable('contest_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  contestId: uuid('contest_id')
    .notNull()
    .references(() => contests.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  placement: integer('placement'),
  judgeNotes: text('judge_notes'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contestsRelations = relations(contests, ({ many }) => ({
  entries: many(contestEntries),
}));

export const contestEntriesRelations = relations(contestEntries, ({ one }) => ({
  contest: one(contests, { fields: [contestEntries.contestId], references: [contests.id] }),
  project: one(projects, { fields: [contestEntries.projectId], references: [projects.id] }),
  user: one(users, { fields: [contestEntries.userId], references: [users.id] }),
}));
