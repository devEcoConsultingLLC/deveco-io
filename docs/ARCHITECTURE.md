# Architecture

## Overview

devEco.io is a monorepo-based platform using Turborepo + pnpm workspaces.

## Package Structure

```
apps/
  web/     - Nuxt 3 SSR application (frontend + server routes)
  api/     - Fastify public REST API with OpenAPI/Swagger

packages/
  db/      - Drizzle ORM schema, migrations, seed data (PostgreSQL 16)
  auth/    - Better Auth configuration (server + client)
  trpc/    - tRPC routers, middleware, business logic
  ui/      - shadcn-vue components customized to brand
  config/  - Shared TypeScript, ESLint, Prettier configs
```

## Data Flow

1. **Browser** -> Nuxt pages (SSR or CSR)
2. **Nuxt server routes** -> tRPC routers -> Drizzle ORM -> PostgreSQL
3. **External clients** -> Fastify API -> Drizzle ORM -> PostgreSQL
4. **File uploads** -> Presigned URLs -> S3-compatible storage (MinIO/DO Spaces)
5. **Search** -> Meilisearch (projects, hardware indexed)

## Key Decisions

- **Dual API**: Internal tRPC for type safety; public Fastify REST for third-party integrations
- **JSONB content**: TipTap editor stores content as JSON in PostgreSQL
- **Presigned uploads**: Files never stream through the app server
- **Semantic tokens**: All styling uses CSS variable design tokens, enabling dark mode
- **AGPL-3.0**: Strong copyleft with SaaS protection

See `docs/decisions/` for detailed Architecture Decision Records.
