import {
  pgTable,
  uuid,
  varchar,
  integer,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { hardwareItems } from './hardware';

export const tagCategoryEnum = pgEnum('tag_category', [
  'platform',
  'language',
  'framework',
  'topic',
]);

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 64 }).notNull().unique(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  category: tagCategoryEnum('category'),
  usageCount: integer('usage_count').default(0).notNull(),
});

export const projectTags = pgTable(
  'project_tags',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.tagId] })],
);

export const hardwareTags = pgTable(
  'hardware_tags',
  {
    hardwareItemId: uuid('hardware_item_id')
      .notNull()
      .references(() => hardwareItems.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.hardwareItemId, t.tagId] })],
);

export const tagsRelations = relations(tags, ({ many }) => ({
  projectTags: many(projectTags),
  hardwareTags: many(hardwareTags),
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, { fields: [projectTags.projectId], references: [projects.id] }),
  tag: one(tags, { fields: [projectTags.tagId], references: [tags.id] }),
}));

export const hardwareTagsRelations = relations(hardwareTags, ({ one }) => ({
  hardwareItem: one(hardwareItems, {
    fields: [hardwareTags.hardwareItemId],
    references: [hardwareItems.id],
  }),
  tag: one(tags, { fields: [hardwareTags.tagId], references: [tags.id] }),
}));
