# Sprint Log

## Sprint 1: Foundation Scaffolding (2026-01-30)

### Goals
- Set up complete monorepo structure
- Create all packages with working TypeScript configs
- Implement database schema
- Build out Nuxt app with all page stubs
- Set up Docker dev environment
- Get the dev server to actually start and render pages

### Outcomes
- 170+ files created across 8 workspace packages
- 15+ database tables defined with Drizzle ORM
- 9 tRPC routers with full CRUD operations
- 15+ shadcn-vue components customized with brand color variants
- 7 page types with 3 layouts and 25+ app components
- Docker Compose dev + prod stacks configured
- CI/CD pipelines (GitHub Actions)
- Full documentation suite (7 docs, 6 ADRs, tracking, handoffs)
- AGPL-3.0 license

### Bug Fixes During Setup
- Fixed 10+ dependency version mismatches (trpc-nuxt, tiptap, drizzle, fastify, better-auth, tailwindcss, etc.)
- Upgraded `@nuxtjs/tailwindcss` from v6 to v7 beta for Tailwind v4 support
- Added explicit `tailwindcss@^4.1.18` dep for pnpm resolution
- Fixed trpc-nuxt v2 import (`createTRPCNuxtHandler` from `trpc-nuxt/server`)
- Fixed h3 API (`sendWebResponse` not `fromWebResponse`)
- Added try/catch to auth middleware for graceful DB-down handling
- Fixed Nuxt component auto-import with `pathPrefix: false`
- Removed duplicate `defineProps` call in BOMTable.vue
- Added missing `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` deps
- Removed obsolete `version` key from docker-compose.yml

### Verified Working
- `pnpm install` — clean
- `pnpm --filter @deveco/web dev` — Nuxt 3.21 starts at localhost:3000
- All 7 page routes return HTTP 200 with SSR
- Tailwind v4 CSS tokens load correctly
- Fonts load via @nuxt/fonts
- Logo SVG and animations render
- Docker Compose config validates

### Not Yet Tested
- Full auth flow (needs PostgreSQL)
- Project CRUD through editor (needs PostgreSQL + tRPC)
- File uploads (needs MinIO)
- Search (needs Meilisearch)
- Fastify API (needs PostgreSQL)
- Database migrations and seed script
