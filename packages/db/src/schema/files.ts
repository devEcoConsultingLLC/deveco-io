import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { users } from './users';

export const filePurposeEnum = pgEnum('file_purpose', [
  'cover',
  'content',
  'schematic',
  'attachment',
]);

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  uploaderId: uuid('uploader_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  filename: varchar('filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 128 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  storageKey: text('storage_key').notNull(),
  publicUrl: text('public_url'),
  purpose: filePurposeEnum('purpose').default('attachment').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
  uploader: one(users, { fields: [files.uploaderId], references: [users.id] }),
  project: one(projects, { fields: [files.projectId], references: [projects.id] }),
}));
