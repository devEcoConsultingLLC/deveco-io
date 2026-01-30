import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { projects } from './projects';

export const communityRoleEnum = pgEnum('community_role', ['member', 'moderator', 'admin']);

export const communities = pgTable('communities', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  bannerUrl: text('banner_url'),
  portalNetworkId: varchar('portal_network_id', { length: 128 }),
  memberCount: integer('member_count').default(0).notNull(),
  projectCount: integer('project_count').default(0).notNull(),
  isOfficial: boolean('is_official').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const communityMembers = pgTable(
  'community_members',
  {
    communityId: uuid('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: communityRoleEnum('role').default('member').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.communityId, t.userId] })],
);

export const communityProjects = pgTable(
  'community_projects',
  {
    communityId: uuid('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.communityId, t.projectId] })],
);

export const communitiesRelations = relations(communities, ({ many }) => ({
  members: many(communityMembers),
  projects: many(communityProjects),
}));

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
  user: one(users, { fields: [communityMembers.userId], references: [users.id] }),
}));

export const communityProjectsRelations = relations(communityProjects, ({ one }) => ({
  community: one(communities, {
    fields: [communityProjects.communityId],
    references: [communities.id],
  }),
  project: one(projects, { fields: [communityProjects.projectId], references: [projects.id] }),
}));
