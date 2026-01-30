import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';

export const hardwareItems = pgTable('hardware_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  vendor: varchar('vendor', { length: 128 }),
  category: varchar('category', { length: 64 }),
  description: text('description'),
  specs: jsonb('specs'),
  imageUrl: text('image_url'),
  purchaseUrl: text('purchase_url'),
  priceUsd: numeric('price_usd', { precision: 10, scale: 2 }),
  projectCount: integer('project_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const projectComponents = pgTable('project_components', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  hardwareItemId: uuid('hardware_item_id').references(() => hardwareItems.id, {
    onDelete: 'set null',
  }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  notes: text('notes'),
  purchaseUrl: text('purchase_url'),
  priceUsd: numeric('price_usd', { precision: 10, scale: 2 }),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const hardwareItemsRelations = relations(hardwareItems, ({ many }) => ({
  projectComponents: many(projectComponents),
}));

export const projectComponentsRelations = relations(projectComponents, ({ one }) => ({
  project: one(projects, { fields: [projectComponents.projectId], references: [projects.id] }),
  hardwareItem: one(hardwareItems, {
    fields: [projectComponents.hardwareItemId],
    references: [hardwareItems.id],
  }),
}));
