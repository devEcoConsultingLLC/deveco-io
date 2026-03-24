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

## Polish pass (same session)

- Fixed wordmark to read "devEco.io" with teal "Eco" and dimmed ".io"
- Added top banner: "Backed by EDGE AI FOUNDATION . Part of the Internet of Communities"
- Hero now matches mockup: "Build Edge AI Projects That Matter" with gradient text, large logo on right, stats row (Projects, Members, Communities)
- Removed redundant platform stats sidebar widget (hero has stats)
- Added "Backed by EDGE AI FOUNDATION" badge in footer
- Added Internet of Communities callout in footer bottom (linked to thedeveco.com/community)
- Fixed body margin (html/body margin: 0)
- Full-width sections (hero, footer, top banner, tabs bar) no longer rounded
- Editor polish: color-coded block picker icons by type, larger icons (34px), softer borders, better input focus states, rounded block wrappers
- Replaced `[cpub]` logo in editor topbar with DevEcoLogo component
- Fixed auth origin: `.env` NUXT_PUBLIC_SITE_URL and NUXT_AUTH_ORIGIN set to localhost:3000 for dev
- Fixed CSP: added Google Fonts and Vite blob workers to allowed sources
- Federation enabled
- CommonPub links point to GitHub (github.com/commonpub/commonpub)

## Session: Image upload & audit fixes (2026-03-24)

### What was done

1. **ImageUpload component** (`components/ImageUpload.vue`): Reusable upload widget with drag-to-upload, preview, hover-to-change overlay, remove button. Posts to `/api/files/upload` with purpose field. Validates image type and 10MB size limit client-side.
2. **Hub create page** (`pages/hubs/create.vue`): Replaced plain URL inputs for icon/banner with ImageUpload components.
3. **Hub settings page** (`pages/hubs/[slug]/settings.vue`): Same swap — ImageUpload for both branding fields.
4. **Upload endpoint hardening** (`server/api/files/upload.post.ts`): Added explicit validation for `purpose` parameter instead of unsafe type cast.
5. **Hub RSS feed fix** (`server/api/hubs/[slug]/feed.xml.get.ts`): Description now uses `item.description ?? item.title` instead of duplicating title. Channel title changed from "CommonPub" to "devEco.io".
6. **Sitemap date fix** (`server/routes/sitemap.xml.ts`): Hub and learning path entries now prefer `updatedAt` over `createdAt`, with null fallback.

### Files changed
- `components/ImageUpload.vue` (new)
- `pages/hubs/create.vue`
- `pages/hubs/[slug]/settings.vue`
- `server/api/files/upload.post.ts`
- `server/api/hubs/[slug]/feed.xml.get.ts`
- `server/routes/sitemap.xml.ts`

## Session: Full production deployment + UI overhaul (2026-03-24)

### Infrastructure deployed
- **DigitalOcean droplet** `deveco-app` s-2vcpu-4gb ($24/mo) at 104.236.69.120, nyc3
- **Managed PostgreSQL 16** `deveco-pg` ($15/mo), firewall restricted to tag:deveco
- **DO Spaces** `deveco` bucket for S3 file uploads (avatars, covers, content images)
- **Caddy** reverse proxy with auto-TLS (Let's Encrypt), HSTS, security headers
- **Redis 7 + Meilisearch v1.12** in Docker Compose
- **GitHub Actions** auto-deploy: push to main → build on GH runners → push to DO Container Registry → pull on droplet
- **Resend** email (noreply@deveco.io) with DKIM, SPF, DMARC DNS records
- **DNS**: A, AAAA, CNAME(www), CAA records on deveco.io

### Features added
1. **Content starter form** — title, description, cover image form before entering editor. Creates draft on submit so autosave works immediately.
2. **Publish validation** — requires title, description, cover image, tags, and content before publishing.
3. **Composable extraction** — `useContentSave.ts` (save/autosave/publish), `usePublishValidation.ts` (required fields). Edit.vue reduced from 894→426 lines.
4. **Build step auto-numbering** — step numbers computed from block position, not static content.
5. **Inline search bar** — header search is an actual input with Cmd+K focus, submits to /search.
6. **Auto-admin plugin** — first user promoted to admin in dev mode.
7. **ImageUpload cover aspect** — 16:9 for covers, 4:1 for banners, square for avatars.

### Bugs fixed
- **CSP blocking JS/fonts in production** — added `unsafe-inline` for scripts, Google Fonts to style-src
- **Feature flags not loading** — `FEATURE_CONTESTS` etc. added to .env, container force-recreated
- **Sign out 415 error** — Better Auth requires Content-Type: application/json on POST
- **Admin access denied** — Better Auth doesn't return custom DB columns (role, username) in session. Added `enrichUser()` to auth middleware that queries users table after session resolution.
- **Hub settings validation** — sent null instead of undefined for empty optional fields
- **Hub icon/banner not showing** — hardcoded wrench icon replaced with dynamic `iconUrl`/`bannerUrl` from API
- **Upload 500** — `@aws-sdk/client-s3` was missing from dependencies
- **`useRoute()` in async handlers** — removed `computed(useRoute())` from composable async functions
- **Droplet OOM** — Docker build was happening on 2GB droplet; moved to GH Actions runners
- **Content card sizing** — fixed 180px thumbnail height

### deveco design system restyle
- Hub detail page: gradient banner, rounded icon, Nunito headings, rounded cards/tabs/badges, soft shadows
- Content cards: rounded corners, 180px thumbnails, soft hover shadow
- Build step blocks: left green border, circular step numbers, tinted header
- Auth login/register: deveco-dark-green buttons, rounded inputs, 1px borders
- Profile page: rounded avatars, soft shadows, deveco-green active tabs
- Feed cards, discussion items, member cards, sidebar: all rounded, 1px borders
- Mobile nav: proper flex containment, hamburger menu working

### Architecture (separation of concerns)
All new features added to **commonpub reference app first**, then skinned for deveco:
- `composables/useContentSave.ts` — in both repos
- `composables/usePublishValidation.ts` — in both repos
- `components/ContentStarterForm.vue` — cpub- classes in commonpub, deveco overrides in deveco-io
- `components/PublishErrorsModal.vue` — same pattern
- `components/ImageUpload.vue` — same pattern

### Users
- `moheeb_deveco` (moheeb@thedeveco.com) — admin
- `testuser` (test@deveco.io) — admin (test account)

## Known issues / next steps

- **Dark mode**: theme CSS includes dark mode tokens but toggle needs wiring
- **Search page**: still CommonPub brutalist styling, needs deveco design pass
- **Starter form styling**: needs more polish (cover upload zone, overall feel)
- **Content card grids**: homepage feed shows cards too wide when only 1-2 items
- **CSRF**: POST endpoints lack origin/referrer validation
- **View dedup**: in-memory Map; should migrate to Redis for production
- **CSS `!important`**: ~29 instances in deveco-theme.css
- **`@commonpub/auth` upstream**: should add `additionalFields` config for role/username so `enrichUser()` workaround isn't needed
- **Search bar**: header input submits to /search?q= but search page may not read the query param
- **Mobile**: deeper pages (editor, hub detail) need responsive passes
