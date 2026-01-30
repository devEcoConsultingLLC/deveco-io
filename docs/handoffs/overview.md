# Handoff Overview

Last updated: 2026-01-30

## What is devEco.io?

An open-source Edge AI project sharing and community platform backed by Edge AI Foundation, part of the portalNetwork "Internet of Communities." Think "Instructables meets Hackster.io" for Edge AI — makers share projects with code, schematics, and bills of materials; browse a hardware catalog; participate in contests; and join communities.

## Current State

**The project scaffolding is complete and the dev server runs.** All 170+ files across 8 workspace packages have been created. The Nuxt app starts, renders all pages with SSR, and serves Tailwind v4 styles. Backend features (auth, CRUD, search, uploads) require Docker services running.

```bash
# Quick start (frontend only, no Docker needed)
pnpm install
pnpm --filter @deveco/web dev
# http://localhost:3000

# Full stack (needs Docker)
docker compose -f docker/docker-compose.yml up -d
pnpm db:push && pnpm db:seed
pnpm --filter @deveco/web dev
```

## Quick Orientation

1. **Check status first**: `docs/tracking/status.md` — what works, what doesn't, known issues
2. **Understand architecture**: `docs/ARCHITECTURE.md` and `docs/handoffs/architecture-context.md`
3. **Full implementation plan**: `docs/plans/implementation-plan.md` — the master plan with all specs
4. **Code conventions**: `.claude-rules`
5. **Set up locally**: `docs/SETUP.md`

## Project Structure

```
apps/
  web/          → Nuxt 3 frontend (package: @deveco/web)
  api/          → Fastify public REST API (package: @deveco/api)
packages/
  db/           → Drizzle ORM schema + migrations (package: @deveco/db)
  auth/         → Better Auth config (package: @deveco/auth)
  trpc/         → tRPC routers + business logic (package: @deveco/trpc)
  ui/           → shadcn-vue component library (package: @deveco/ui)
  config/       → Shared TS/ESLint/Prettier configs (package: @deveco/config)
docker/         → Docker Compose (dev + prod), Dockerfiles, nginx
docs/           → Architecture, setup, tracking, handoffs, ADRs
mockups/        → Original HTML mockups (reference only)
```

## Key Files

| Purpose | Location |
|---------|----------|
| Master plan | `docs/plans/implementation-plan.md` |
| Database schema (15+ tables) | `packages/db/src/schema/` |
| Business logic (9 routers) | `packages/trpc/src/router/` |
| UI components (15+ shadcn-vue) | `packages/ui/src/components/` |
| Page components (7 page types) | `apps/web/pages/` |
| App components (25+) | `apps/web/components/` |
| Theme tokens (Tailwind v4) | `apps/web/assets/css/main.css` |
| Logo SVG (exact mockup) | `apps/web/components/shared/DevEcoLogo.vue` |
| Composables | `apps/web/composables/` |
| Server middleware/API | `apps/web/server/` |
| Docker dev stack | `docker/docker-compose.yml` |
| Public API routes | `apps/api/src/routes/` |
| Seed data | `packages/db/src/seed/` |

## Important Notes

- **Package filter**: Use `pnpm --filter @deveco/web dev`, not `--filter web`. Turborepo/pnpm filter by package.json `name`, not directory.
- **Tailwind v4 beta**: Using `@nuxtjs/tailwindcss@7.0.0-beta.1` — this is required for Tailwind v4's `@import "tailwindcss"` and `@theme` syntax.
- **Auth graceful degradation**: The server middleware catches DB errors so pages render even without PostgreSQL.
- **trpc-nuxt v2**: Uses `createTRPCNuxtHandler` from `trpc-nuxt/server` (not the v1 `createNuxtApiHandler`).
- **h3 API**: Uses `sendWebResponse` (not `fromWebResponse` which doesn't exist in h3 v1.15).

## Architecture Decisions

See `docs/decisions/` for ADRs:
- 001: Monorepo structure
- 002: Vue/Nuxt over React
- 003: Tailwind v4 tokens
- 004: TipTap editor
- 005: Auth strategy
- 006: AGPL license

## What Needs Work Next

See `docs/tracking/status.md` for the full list. Priority items:
1. End-to-end auth flow with Docker services
2. Project CRUD through the TipTap editor
3. Meilisearch indexing pipeline
4. File upload via MinIO presigned URLs
5. Responsive design pass
6. Fastify API testing
