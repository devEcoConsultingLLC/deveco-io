# devEco.io -- Implementation Plan

## What We Are Building

devEco.io is an open-source Edge AI project sharing and community platform backed by Edge AI Foundation, part of the portalNetwork "Internet of Communities." The platform enables makers, engineers, and researchers to share Edge AI projects with code, schematics, and bills of materials; browse a hardware catalog; participate in contests; and join communities.

### Pages (from mockups)
- **Homepage** -- hero, featured projects grid, events, sidebar widgets, partner logos
- **Project Detail** -- gradient hero, tabbed content (overview/code/schematics/BOM/comments), related projects sidebar
- **Project Editor** -- three-column layout: content nav, TipTap rich text editor, settings panel
- **Contests** -- active/upcoming/past tabs, contest cards with prizes and sponsors
- **Hardware Catalog** -- filterable grid, vendor/category/price filters
- **User Profile** -- avatar, bio, stats, projects grid, followers/following tabs
- **Communities** -- portalNetwork integration, community cards, member counts

---

## Tech Stack

| Layer | Choice | Key Reason |
|-------|--------|------------|
| Frontend | **Vue 3 + Nuxt 3** | SSR, file-based routing, auto-imports, excellent SEO, server routes |
| Styling | **Tailwind CSS v4** + CSS variable tokens | CSS-first config maps to design tokens, shadcn-vue compatible |
| Components | **shadcn-vue** (customized) | Vue port of shadcn/ui, full source control, accessible defaults |
| Editor | **TipTap** (Vue 3 bindings) | Native Vue support, extensible ProseMirror blocks, JSON storage |
| API (internal) | **tRPC** (trpc-nuxt) | End-to-end TypeScript type safety with Vue Query integration |
| API (public) | **Fastify** | OpenAPI schema generation, high performance, standalone service |
| Database | **PostgreSQL 16 + Drizzle ORM** | SQL-first, type-safe, clean migrations, zero binary deps |
| Auth | **Better Auth** (Nuxt plugin) | Open source, self-hosted, plugin architecture, no vendor lock-in |
| Storage | **DigitalOcean Spaces** (prod) / **MinIO** (dev) | S3-compatible, presigned URL uploads, same SDK for both |
| Search | **Meilisearch** | Typo tolerance, faceted search, instant results, single binary |
| Monorepo | **Turborepo + pnpm** | Simple config, fast caching, low contributor friction |
| Deploy | **Docker Compose** on DO Droplet + **DO Spaces** | Full control, ~$29/mo starting, identical local/prod stack |
| License | **AGPL-3.0** | Strong copyleft, SaaS protection, open source integrity |

---

## Project Structure

```
deveco-io/
  .github/
    workflows/
      ci.yml                     # Lint, typecheck, test on PR
      deploy-staging.yml         # Deploy on merge to develop
      deploy-prod.yml            # Deploy on release tag
    ISSUE_TEMPLATE/
    PULL_REQUEST_TEMPLATE.md

  apps/
    web/                         # Nuxt 3 application
      pages/
        index.vue                # Homepage
        projects/
          index.vue              # Browse projects
          new.vue                # Create project (redirect to editor)
          [slug].vue             # Project detail
          [slug]/edit.vue        # Project editor
        contests/
          index.vue              # Contests listing
          [slug].vue             # Contest detail
        hardware/
          index.vue              # Hardware catalog
          [slug].vue             # Hardware item detail
        communities/
          index.vue              # Communities listing
          [slug].vue             # Community hub
        profile/
          [username].vue         # User profile
        settings.vue             # User settings
        auth/
          login.vue
          register.vue
      layouts/
        default.vue              # Main layout (header, footer, nav)
        editor.vue               # Editor layout (three-column)
        auth.vue                 # Minimal layout for auth pages
      components/
        layout/
          AppHeader.vue
          AppFooter.vue
          AppSidebar.vue
          TopBanner.vue
          NavDropdown.vue
        project/
          ProjectCard.vue
          ProjectHero.vue
          ProjectTabs.vue
          BOMTable.vue
          ProjectGrid.vue
        editor/
          EditorLayout.vue       # Three-column grid
          EditorSidebar.vue      # Left nav (sections, media)
          EditorMain.vue         # TipTap rich text area
          EditorSettings.vue     # Right panel (cover, tags, visibility)
          blocks/                # Custom TipTap node views
            CodeBlock.vue
            SchematicBlock.vue
            BOMBlock.vue
            ImageBlock.vue
        contest/
          ContestCard.vue
          ContestHero.vue
          ContestTabs.vue
        hardware/
          HardwareCard.vue
          HardwareFilters.vue
          HardwareGrid.vue
        community/
          CommunityCard.vue
          PortalNetworkBanner.vue
        profile/
          ProfileHero.vue
          ProfileTabs.vue
          ProfileStats.vue
        shared/
          DevEcoLogo.vue         # SVG logo component (exact mockup SVG preserved)
          DevEcoLogoAnimated.vue # Animated variants (breathe, pulse, glow, float)
          SearchCommand.vue      # Cmd+K search modal (Meilisearch)
          AppAvatar.vue
          AppBadge.vue
          AppTag.vue
      composables/
        useTrpc.ts               # tRPC Vue client composable
        useAuth.ts               # Better Auth composable
        useUpload.ts             # File upload composable (presigned URLs)
        useSearch.ts             # Meilisearch composable
        useTheme.ts              # Dark/light mode composable
      server/
        api/
          trpc/[trpc].ts         # tRPC Nuxt handler
          auth/[...all].ts       # Better Auth catch-all
          upload.post.ts         # Presigned URL endpoint
        middleware/
          auth.ts                # Server-side auth check
      plugins/
        auth.ts                  # Better Auth plugin init
        trpc.ts                  # tRPC plugin init
      assets/
        css/
          main.css               # Tailwind v4 theme tokens + global styles
      app.config.ts
      nuxt.config.ts
      tsconfig.json

    api/                         # Fastify public REST API (standalone service)
      src/
        index.ts                 # Fastify server bootstrap
        routes/
          projects.ts            # /api/v1/projects
          hardware.ts            # /api/v1/hardware
          contests.ts            # /api/v1/contests
          communities.ts         # /api/v1/communities
          users.ts               # /api/v1/users
          search.ts              # /api/v1/search
        plugins/
          auth.ts                # API key / Bearer token auth
          cors.ts
          rateLimit.ts
          swagger.ts             # OpenAPI/Swagger generation
        schemas/                 # JSON Schema / Typebox request/response schemas
      Dockerfile
      package.json
      tsconfig.json

  packages/
    trpc/                        # tRPC routers + business logic (shared)
      src/
        root.ts                  # Merged router
        router/
          project.ts
          user.ts
          contest.ts
          hardware.ts
          community.ts
          comment.ts
          search.ts
          upload.ts
          tag.ts
        middleware/
          auth.ts                # Auth middleware
          rateLimit.ts
        context.ts               # tRPC context (db, session)
        trpc.ts                  # tRPC init, base procedures
      package.json
      tsconfig.json

    db/                          # Drizzle schema + migrations
      src/
        index.ts                 # Export db client + schema
        schema/
          users.ts
          projects.ts
          hardware.ts
          contests.ts
          communities.ts
          comments.ts
          tags.ts
          files.ts
        seed/
          index.ts               # Dev seed script
          fixtures/              # JSON seed data
        client.ts                # Drizzle client init
      drizzle/
        migrations/              # Generated SQL migrations
      drizzle.config.ts
      package.json
      tsconfig.json

    ui/                          # Shared Vue component library (shadcn-vue based)
      src/
        components/              # shadcn-vue customized components
          Button.vue
          Input.vue
          Textarea.vue
          Select.vue
          Dialog.vue
          DropdownMenu.vue
          Tabs.vue
          Card.vue
          Badge.vue
          Avatar.vue
          Tooltip.vue
          Command.vue            # cmdk-based command palette
          Table.vue
          Skeleton.vue
          Toast.vue
        primitives/
          Icon.vue
          Spinner.vue
        utils.ts                 # cn() helper
      package.json
      tsconfig.json

    auth/                        # Better Auth configuration (shared)
      src/
        index.ts                 # Auth instance (server)
        client.ts                # Auth client (browser)
        config.ts                # Provider config (email/password, GitHub, Google)
      package.json
      tsconfig.json

    config/                      # Shared configs
      eslint/
        base.js
        nuxt.js
        vue.js
      typescript/
        base.json
        nuxt.json
        library.json
      prettier/
        index.js
      package.json

  docker/
    Dockerfile.web               # Multi-stage Nuxt 3 build
    Dockerfile.api               # Fastify API build
    docker-compose.yml           # Full local dev stack
    docker-compose.prod.yml      # Production compose (Droplet)
    nginx/
      nginx.conf                 # Reverse proxy, SSL termination
    scripts/
      init-minio.sh              # Create buckets on first run
      seed-db.sh                 # Run seed after DB init

  docs/
    tracking/                    # Sprint tracking, progress logs
      sprint-log.md
      status.md
    plans/                       # Architecture plans, phase plans
      phase-1.md
      phase-2.md
    handoffs/                    # Handoff documents for contributors/AI agents
      overview.md
      architecture-context.md
    decisions/                   # Architecture Decision Records (ADRs)
      001-monorepo-structure.md
      002-vue-nuxt-over-react.md
      003-tailwind-v4-tokens.md
      004-tiptap-editor.md
      005-auth-strategy.md
      006-agpl-license.md
    ARCHITECTURE.md
    CONTRIBUTING.md
    SETUP.md
    DESIGN_SYSTEM.md
    API.md
    DEPLOYMENT.md
    ROADMAP.md

  mockups/                       # Existing HTML mockups (preserved as-is)
    design-system.html
    editor.html
    index.html
    pages.html
    project.html

  .claude-rules                  # AI assistant rules file
  turbo.json
  pnpm-workspace.yaml
  package.json
  .env.example
  .gitignore
  LICENSE                        # AGPL-3.0
```

---

## Theme System Architecture

### Tailwind v4 CSS Variable Tokens

All design tokens from the mockups defined in `apps/web/assets/css/main.css`:

```css
@import "tailwindcss";

@theme {
  /* Brand Colors (exact from mockup design-system.html) */
  --color-brand-dark: #004e53;
  --color-brand-light: #00e7ad;
  --color-brand-pink: #e85a85;
  --color-brand-yellow: #f4c84b;
  --color-brand-teal: #4db3a8;
  --color-brand-teal-light: #6ab4a8;
  --color-brand-blue: #5bc5e8;
  --color-brand-purple: #5f2bef;
  --color-brand-dark-blue: #1b357d;
  --color-brand-aqua: #42fffe;
  --color-portal-purple: #5865F2;

  /* Semantic Colors (light mode defaults) */
  --color-background: #ffffff;
  --color-foreground: #111827;
  --color-muted: #f3f4f6;
  --color-muted-foreground: #6b7280;
  --color-card: #ffffff;
  --color-card-foreground: #111827;
  --color-border: #e5e7eb;
  --color-input: #e5e7eb;
  --color-ring: #004e53;
  --color-primary: #004e53;
  --color-primary-foreground: #ffffff;
  --color-secondary: #00e7ad;
  --color-secondary-foreground: #004e53;
  --color-accent: #f3f4f6;
  --color-accent-foreground: #111827;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;

  /* Typography */
  --font-sans: 'Poppins', system-ui, sans-serif;
  --font-display: 'Nunito', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-default: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Dark Mode */
.dark {
  --color-background: #111827;
  --color-foreground: #f9fafb;
  --color-muted: #1f2937;
  --color-muted-foreground: #9ca3af;
  --color-card: #1f2937;
  --color-card-foreground: #f9fafb;
  --color-border: #374151;
  --color-input: #374151;
  --color-ring: #00e7ad;
  --color-primary: #00e7ad;
  --color-primary-foreground: #004e53;
  --color-secondary: #004e53;
  --color-secondary-foreground: #00e7ad;
  --color-accent: #374151;
  --color-accent-foreground: #f9fafb;
}
```

### Dark Mode Strategy
- Class-based toggle (`<html class="dark">`)
- `useTheme` composable stores preference in localStorage, respects `prefers-color-scheme` as default
- Brand colors (pink, yellow, teal, blue) stay constant; backgrounds/foregrounds/borders shift
- All components use semantic token classes (`bg-primary`, `text-foreground`) so they auto-adapt

### Logo SVG Preservation
The exact SVG from the mockups is preserved as a Vue SFC (`DevEcoLogo.vue`) with props for variant (light-bg, dark-bg, gradient-bg). The animated variants (breathe, pulse, glow, float) are in `DevEcoLogoAnimated.vue` using scoped CSS keyframe animations matching the mockup definitions exactly. The SVG viewBox, transform, path data, and polygon fill colors are copied verbatim from `mockups/design-system.html`.

### shadcn-vue Integration
- shadcn-vue uses the same CSS variable theming approach as shadcn/ui
- Components are generated into `packages/ui/src/components/` with full source ownership
- Custom button variants added for brand colors: `accent`, `pink`, `yellow`, `blue` (matching mockup button styles)
- `cn()` utility from `packages/ui/src/utils.ts` merges Tailwind classes

---

## Database Schema (Core Tables)

15+ tables across schema files in `packages/db/src/schema/`:

### users.ts
- `users` -- id, email, username, displayName, avatarUrl, bio, role, timestamps
- `sessions` -- id, userId, token, expiresAt, ipAddress, userAgent
- `accounts` -- id, userId, provider (email/github/google), providerAccountId, tokens
- `follows` -- followerId, followingId, compound PK

### projects.ts
- `projects` -- id, slug, title, summary, content (JSONB for TipTap), coverImageUrl, authorId, status (draft/published/archived), difficulty, license, repoUrl, viewCount, likeCount, commentCount, featured, publishedAt, timestamps
- `project_versions` -- id, projectId, version, content (JSONB snapshot), changelog

### hardware.ts
- `hardware_items` -- id, slug, name, vendor, category, description, specs (JSONB), imageUrl, purchaseUrl, priceUsd, projectCount
- `project_components` -- id, projectId, hardwareItemId (nullable), name, quantity, notes, purchaseUrl, priceUsd, sortOrder

### contests.ts
- `contests` -- id, slug, title, description, rules, coverImageUrl, sponsorName, sponsorLogoUrl, prizeDescription, prizeValueUsd, status (upcoming/active/judging/ended), startsAt, endsAt
- `contest_entries` -- id, contestId, projectId, userId, placement, judgeNotes, submittedAt

### communities.ts
- `communities` -- id, slug, name, description, iconUrl, bannerUrl, portalNetworkId, memberCount, projectCount, isOfficial
- `community_members` -- communityId, userId, role (member/moderator/admin), compound PK
- `community_projects` -- communityId, projectId, compound PK

### tags.ts
- `tags` -- id, name, slug, category (platform/language/framework/topic), usageCount
- `project_tags` -- projectId, tagId, compound PK
- `hardware_tags` -- hardwareItemId, tagId, compound PK

### comments.ts
- `comments` -- id, projectId, authorId, parentId (self-ref for threading), body, likeCount
- `likes` -- userId, projectId (nullable), commentId (nullable), unique constraints

### files.ts
- `files` -- id, uploaderId, projectId, filename, mimeType, sizeBytes, storageKey (S3 object key), publicUrl, purpose (cover/content/schematic/attachment)

All tables use UUID PKs and created_at/updated_at timestamps.

---

## Implementation Order (Files to Create)

### Batch 1: Project Scaffolding
1. `pnpm-workspace.yaml`
2. `package.json` (root)
3. `turbo.json`
4. `.env.example`
5. `.gitignore`
6. `.claude-rules`
7. `LICENSE` (AGPL-3.0)

### Batch 2: Shared Configs
8. `packages/config/typescript/base.json`
9. `packages/config/typescript/nuxt.json`
10. `packages/config/typescript/library.json`
11. `packages/config/eslint/base.js`
12. `packages/config/eslint/vue.js`
13. `packages/config/prettier/index.js`

### Batch 3: Database Package
14. `packages/db/package.json` + `tsconfig.json`
15. `packages/db/drizzle.config.ts`
16. `packages/db/src/client.ts`
17. `packages/db/src/schema/*.ts` (all schema files)
18. `packages/db/src/index.ts`
19. `packages/db/src/seed/index.ts`

### Batch 4: Auth Package
20. `packages/auth/package.json` + `tsconfig.json`
21. `packages/auth/src/config.ts`
22. `packages/auth/src/index.ts`
23. `packages/auth/src/client.ts`

### Batch 5: tRPC Package
24. `packages/trpc/package.json` + `tsconfig.json`
25. `packages/trpc/src/trpc.ts`
26. `packages/trpc/src/context.ts`
27. `packages/trpc/src/middleware/auth.ts`
28. `packages/trpc/src/router/*.ts` (all routers)
29. `packages/trpc/src/root.ts`

### Batch 6: UI Package (shadcn-vue)
30. `packages/ui/package.json` + `tsconfig.json`
31. `packages/ui/src/utils.ts`
32. `packages/ui/src/components/*.vue` (all shadcn-vue components)

### Batch 7: Nuxt App
33. `apps/web/package.json`
34. `apps/web/nuxt.config.ts`
35. `apps/web/tsconfig.json`
36. `apps/web/assets/css/main.css` (theme tokens)
37. `apps/web/layouts/default.vue`
38. `apps/web/components/shared/DevEcoLogo.vue` (exact SVG preserved)
39. `apps/web/components/shared/DevEcoLogoAnimated.vue`
40. `apps/web/components/layout/*.vue`
41. `apps/web/composables/*.ts`
42. `apps/web/server/api/*.ts`
43. `apps/web/plugins/*.ts`
44. Page components (all pages/)

### Batch 8: Fastify API
45. `apps/api/package.json` + `tsconfig.json`
46. `apps/api/Dockerfile`
47. `apps/api/src/index.ts`
48. `apps/api/src/plugins/*.ts`
49. `apps/api/src/routes/*.ts`

### Batch 9: Docker and DevOps
50. `docker/docker-compose.yml`
51. `docker/docker-compose.prod.yml`
52. `docker/Dockerfile.web`
53. `docker/Dockerfile.api`
54. `docker/nginx/nginx.conf`
55. `docker/scripts/init-minio.sh`
56. `.github/workflows/ci.yml`
57. `.github/workflows/deploy-staging.yml`
58. `.github/workflows/deploy-prod.yml`

### Batch 10: Documentation
59. `docs/ARCHITECTURE.md`
60. `docs/SETUP.md`
61. `docs/CONTRIBUTING.md`
62. `docs/DESIGN_SYSTEM.md`
63. `docs/API.md`
64. `docs/DEPLOYMENT.md`
65. `docs/ROADMAP.md`
66. `docs/tracking/sprint-log.md`
67. `docs/tracking/status.md`
68. `docs/plans/phase-1.md`
69. `docs/handoffs/overview.md`
70. `docs/handoffs/architecture-context.md`
71. `docs/decisions/001-monorepo-structure.md` through `006-agpl-license.md`
