import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema/dist/*.js',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://commonpub:commonpub_dev@localhost:5432/commonpub',
  },
});
