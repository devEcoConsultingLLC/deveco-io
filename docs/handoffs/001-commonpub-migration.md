# Handoff 001: CommonPub Migration

**Date**: 2024-03-24

## What was done

Replaced the old deveco-io monorepo (Nuxt 3 + tRPC + Drizzle custom stack) with a CommonPub-powered site. The old codebase had scaffolded infrastructure but no working pages. The new site inherits all of CommonPub's features out of the box.

### Steps taken

1. Installed `create-commonpub` CLI from the local commonpub repo via `cargo install --path`
2. Generated a new CommonPub site with these flags:
   - Features: content, social, hubs, contests, admin
   - Content types: project, blog
   - Contest creation: staff (not open to all users)
   - Theme: base (with custom deveco override layer)
3. Created `assets/deveco-theme.css` that overrides CommonPub's base tokens:
   - Colors: dark green #004e53 primary, light green #00e7ad accent, full deveco palette
   - Typography: Poppins (body), Nunito (display headings), JetBrains Mono (code)
   - Shape: 6px rounded corners instead of CommonPub's sharp corners
   - Shadows: soft box-shadows instead of offset brutalist shadows
   - Borders: 1px instead of 2px
   - Dark mode: teal-tinted dark surfaces
4. Created `components/DevEcoLogo.vue` with the exact hexagon SVG from the mockups
5. Rewrote `layouts/default.vue` with deveco-branded header, nav, and footer
   - Nav items: Home, Projects, Blog, Communities, Contests
   - Footer: dark green background, Edge AI Foundation attribution, "Powered by CommonPub"
   - Taller 64px header (vs CommonPub's 48px), rounded elements, softer styling
6. Rewrote `pages/index.vue` with deveco hero, color scheme, and messaging
7. Rewrote `pages/about.vue`, `error.vue`, `layouts/auth.vue` with deveco branding
8. Replaced all "CommonPub" text in SEO meta and page copy with "devEco.io" (except attribution)
9. Removed old monorepo files (apps/, packages/, docker/, turbo.json, pnpm-workspace.yaml, etc.)
10. Moved generated site contents to repo root
11. Verified build succeeds (`nuxt build` completes cleanly)

### What was preserved

- `.git/` -- full git history
- `.github/` -- CI workflows
- `LICENSE` -- AGPL-3.0
- `mockups/` -- HTML design reference files (design-system, editor, pages, project, index)

### What was removed

- `apps/web/` -- old Nuxt 3 app (unused, no working pages)
- `apps/api/` -- old Fastify public API scaffold
- `packages/` -- old db, auth, trpc, ui, config packages
- `docker/` -- replaced by docker-compose.yml at root
- `docs/` -- old architecture/roadmap docs (no longer relevant to new stack)
- Old workspace config files (package.json, turbo.json, pnpm-workspace.yaml, pnpm-lock.yaml)

## Architecture

The site is now a standalone Nuxt 3 app that uses published `@commonpub/*` npm packages (v0.4.0). It is NOT a monorepo. Structure:

```
deveco-io/
  assets/deveco-theme.css    -- theme override (colors, fonts, shape)
  components/                -- Vue components (from CommonPub reference + DevEcoLogo)
  composables/               -- feature flags, auth, content types, etc.
  layouts/                   -- default, auth, editor, admin
  pages/                     -- file-based routing (Nuxt 3)
  server/                    -- Nitro API routes + middleware
  commonpub.config.ts        -- feature flags + instance config
  nuxt.config.ts             -- Nuxt config with theme CSS imports
  mockups/                   -- original design reference HTML files
```

## Feature flags (commonpub.config.ts)

| Feature    | Enabled |
|------------|---------|
| content    | true    |
| social     | true    |
| hubs       | true    |
| contests   | true    |
| admin      | true    |
| docs       | false   |
| video      | false   |
| learning   | false   |
| explainers | false   |
| federation | false   |

Contest creation is restricted to `staff` role.

## Known issues / next steps

- **Database**: needs Postgres, Redis, Meilisearch running (`docker compose up -d`) and schema pushed (`pnpm db:push`)
- **Theme polish**: the deveco theme overrides base tokens but some deeper components (cards, editors, admin panel) still use CommonPub's default styling. These will pick up the token overrides for colors/fonts but may need scoped CSS tweaks for full visual consistency.
- **Dark mode**: theme CSS includes dark mode tokens but the toggle mechanism needs to be wired (set `data-theme="dark"` on html element)
- **CI**: the `.github/` workflows are from the old monorepo and need updating for the new single-app structure
- **Responsive**: hero and main layout are responsive but deeper pages need a pass
- **Auth pages**: login/register pages reference CommonPub form styles. They work but could use deveco-specific styling.
- **Type error**: `isomorphic-dompurify` has an upstream type export issue. Does not affect build or runtime.
