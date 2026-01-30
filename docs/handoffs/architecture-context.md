# Architecture Context

Last updated: 2026-01-30

## Why These Choices?

### Monorepo (Turborepo + pnpm)
- Single repo for all packages reduces coordination overhead
- pnpm workspace protocol for local package linking (`workspace:*`)
- Turborepo caches builds for fast CI
- 8 packages: `@deveco/web`, `@deveco/api`, `@deveco/db`, `@deveco/auth`, `@deveco/trpc`, `@deveco/ui`, `@deveco/config`

### Vue 3 + Nuxt 3
- SSR for SEO (project pages need to be crawlable)
- File-based routing matches page structure
- Server routes eliminate need for separate BFF
- Auto-imports reduce boilerplate
- Component auto-import configured with `pathPrefix: false` so `components/shared/AppAvatar.vue` is just `<AppAvatar>`, not `<SharedAppAvatar>`

### Tailwind v4 + CSS Variables
- CSS-first configuration using `@theme` block in `apps/web/assets/css/main.css`
- Requires `@nuxtjs/tailwindcss@7.0.0-beta.1` (v6 only supports Tailwind v3)
- `tailwindcss@^4.1.18` must be an explicit dependency (pnpm strict resolution)
- Same variable approach as shadcn/ui theming
- Dark mode via `.dark` class toggle + CSS variable overrides
- Brand colors stay constant between themes; semantic tokens (background, foreground, border) shift

### Dual API (tRPC + Fastify)
- tRPC: Internal, type-safe, used by Nuxt frontend via `trpc-nuxt@2.0.1`
  - Server handler: `createTRPCNuxtHandler` from `trpc-nuxt/server`
  - Client: `createTRPCNuxtClient` from `trpc-nuxt/client`
  - SuperJSON transformer for Date/Map/Set serialization
- Fastify: Public REST API for third parties, with OpenAPI/Swagger docs
- Both share the same database via `@deveco/db`

### PostgreSQL + Drizzle ORM
- SQL-first with full TypeScript type safety
- JSONB columns for flexible content (TipTap editor JSON, hardware specs)
- 15+ tables across 7 schema files (users, projects, hardware, contests, communities, tags, comments, files)
- UUID primary keys, created_at/updated_at timestamps on all tables
- Enums for status fields (project status, contest status, difficulty, roles, etc.)
- Clean migration workflow via `drizzle-kit`

### Better Auth
- Self-hosted, no vendor lock-in
- Plugin architecture for extensibility
- Supports email/password + GitHub/Google OAuth (conditional on env vars)
- Auth handler at `/api/auth/[...all]` uses h3's `toWebRequest`/`sendWebResponse`
- Server middleware populates `event.context.session` on every request (with try/catch for graceful DB-down handling)

### S3-Compatible Storage
- MinIO locally (port 9000 API, 9001 console), DigitalOcean Spaces in production
- Same `@aws-sdk/client-s3` SDK and code path for both
- Presigned URLs for direct browser uploads (generated server-side at `/api/upload.post`)
- Files tracked in `files` table with storage_key and purpose enum

### Meilisearch
- Instant search with typo tolerance
- Single binary, easy to self-host (v1.11 in Docker)
- Faceted filtering for hardware catalog
- Client via `meilisearch` npm package in `useSearch` composable
- Cmd+K search modal (`SearchCommand.vue`)

## Gotchas and Lessons Learned

1. **pnpm filter uses package names**: `pnpm --filter @deveco/web dev`, not `--filter web`
2. **h3 has no `fromWebResponse`**: Use `sendWebResponse` instead
3. **trpc-nuxt v2 breaking changes**: Imports moved to `trpc-nuxt/server` and `trpc-nuxt/client` subpaths
4. **Tailwind v4 requires explicit dep**: Even though `@nuxtjs/tailwindcss@7` brings it as a dependency, pnpm needs `tailwindcss` listed explicitly in the web app's package.json for CSS `@import "tailwindcss"` to resolve
5. **`@tiptap` is v3**: The `@tiptap/vue-3` and extensions are at v3.18.x — docs referencing v2 APIs may be outdated
6. **`defineProps` can only be called once**: Per Vue SFC rules, only one `defineProps()` call per `<script setup>` block
7. **Nuxt component pathPrefix**: Set `pathPrefix: false` in `nuxt.config.ts` components config to avoid needing directory-prefixed names like `LayoutAppHeader`
