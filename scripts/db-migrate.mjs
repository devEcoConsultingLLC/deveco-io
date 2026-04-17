/**
 * Non-interactive schema-migration wrapper for CI.
 *
 * Uses drizzle-orm's native `migrate()` function (node-postgres) rather than
 * `drizzle-kit migrate`, because the CLI's `renderWithTask` spinner exits
 * non-zero even on success and swallows error output.
 *
 * Reads committed SQL files shipped inside @commonpub/schema, tracks applied
 * migrations in `drizzle.__drizzle_migrations`, fully non-interactive.
 *
 * Workflow:
 *   1. Schema changes are made in the commonpub repo and committed as .sql files.
 *   2. @commonpub/schema is published to npm with the migrations folder.
 *   3. deveco bumps its @commonpub/schema pin.
 *   4. CI deploy runs this script; drizzle-orm applies any new migrations.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const url = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('❌ db:migrate requires NUXT_DATABASE_URL or DATABASE_URL');
  process.exit(1);
}

const migrationsFolder = process.env.DRIZZLE_MIGRATIONS_FOLDER
  || '/app/node_modules/@commonpub/schema/migrations';

const pool = new pg.Pool({ connectionString: url, max: 2 });
const db = drizzle(pool);

try {
  await migrate(db, { migrationsFolder });
  console.log('✅ db:migrate succeeded');
} catch (err) {
  console.error('❌ db:migrate failed:', err?.message ?? err);
  if (err?.stack) console.error(err.stack);
  process.exit(1);
} finally {
  await pool.end();
}
