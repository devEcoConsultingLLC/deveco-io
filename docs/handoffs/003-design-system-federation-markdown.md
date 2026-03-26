# Handoff 003: Design System Parity, Federation, Markdown Import

**Date**: 2026-03-25

## What was done

### Design system overhaul — full brutalist elimination
- **54 files changed** — replaced ALL offset `box-shadow` patterns (`Xpx Xpx 0`) with soft shadow tokens (`--shadow-sm/md/lg`)
- **70+ instances** of `2px solid` borders changed to `1px solid` in view/block components
- Added `border-radius` (6-12px) to learning page cards, tags, pills, progress bars
- Zero offset shadows remaining in the project

### Content cards match mockup design
- Rewrote `ContentCard.vue` to match mockup `pcard` pattern:
  - `border-radius: 8px`, `aspect-ratio: 4/3` (square-ish)
  - Hover: teal border (`--deveco-teal`) + `shadow-lg` + `translateY(-2px)`
  - Author avatar: 26px rounded-square with gradient fallback (not circle)
  - Difficulty as level badge (dark translucent, top-right) instead of dots
  - Title: 15px weight-700, description: 13px, proper font hierarchy
  - Featured badge: yellow bg, dark text, 3px radius

### Contest banner — no longer hijacks hero
- Hero always shows default "Build Edge AI Projects That Matter" content
- Active contest renders as compact gradient banner (`linear-gradient(135deg, #1b357d, #5f2bef)`) between tabs and feed
- Matches mockup's `fbanner` pattern: aqua glow, yellow CTA button
- Removed oversized featured card — featured items show in normal grid with badge

### Mobile touch targets (WCAG 44px minimum)
- All interactive elements now meet 44px minimum height:
  - Icon buttons: 36→44px
  - Mobile toggle: 36→44px
  - Mobile menu links: min-height 44px
  - Primary/ghost buttons: min-height 44px
  - User dropdown items: min-height 44px
  - Hero dismiss button: 32→44px
  - Homepage feed tabs: 44px + scroll-snap
- Editor mode tabs stay visible at 480px (compact, not hidden)
- Global `@media (pointer: coarse)` rule in deveco-theme.css

### Mobile responsive sweep (19 pages total)
Two batches covering editor, contests, messages, settings, admin, hub members, notifications, feed, content listings, certificates, followers/following

### Markdown import feature
- **`@commonpub/editor` v0.4.3** published with:
  - `markdownToBlockTuples(md)` — unified/remark parser, maps to native BlockTuples
  - `blockTuplesToMarkdown(blocks)` — reverse serializer for export
  - Obsidian callout support (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!DANGER]`)
  - Wikilink preprocessing, code fence `lang:filename` parsing
  - 24 parser tests
- **MarkdownBlock** — split-pane editor (source + live preview)
- **MarkdownImportDialog** — paste/file-drop, block count preview, append/replace mode
- **BlockMarkdownView** — renders markdown blocks on published content pages
- **`/api/files/upload-from-url`** — server-side image proxy (SSRF protected, 10s timeout, 10MB limit)
- Import button in editor topbar (teal, labeled "Import")
- Registered in all 4 editor types and BlockContentRenderer
- Also added to commonpub reference app

### Federation implementation
- **`@commonpub/server` v0.4.4** published with:
  - `createInboxHandlers()` — real DB operations for Follow/Accept/Reject/Undo/Like/Announce
  - `deliverPendingActivities()` — outbound delivery with HTTP Signatures
  - Critical bug fixes: `onUndo` mass-delete, `onLike` URL crash
- Both inbox routes wired to real handlers
- Delivery worker (Nitro plugin, 30s interval)
- Admin federation page with stats + activity log
- Fediverse address on profiles (`@user@deveco.io`)

### Code audit + testing
- 46 tests in deveco-io (contest slugs, domain extraction, profile schema, federation params, auth, inbox keyId)
- Fixed: body double-read in inboxes, domain extraction, param validation, profile empty URL handling
- CI: tests + typecheck + build all green
- commonpub: 2063+ tests across 168 files, all passing

### Other fixes
- Hub assignment dropdown in editor properties panel
- Dark mode toggle in user dropdown
- Avatar images on content cards and header
- Contest admin controls (Activate/Judge/Complete)
- Profile image save (schema extended with avatarUrl/bannerUrl)
- Contest slug auto-generation
- Search route query sync

## Production verification

All endpoints verified working: `/api/me`, profile API, search, contests, WebFinger, NodeInfo, AP Actor

## Packages published
- `@commonpub/server` 0.4.3 → 0.4.4
- `@commonpub/editor` 0.4.3

### CSS cascade layers — proper theming architecture
- **`@commonpub/ui` v0.6.0**: All base theme CSS wrapped in `@layer commonpub { ... }`
- Consuming apps write plain unlayered CSS → automatically wins over the base theme
- Zero `!important` needed — cascade layers handle priority natively
- CommonPub brutalist design preserved in the library for reference app
- deveco-io's soft design overrides it cleanly via `deveco-theme.css`
- This is the industry best practice (CSS Cascade Layers, supported in all modern browsers)

### Design token fixes
- **Dark mode border tokens**: `--border` changed from `#2a4e50` to `#183436` (barely visible against `--surface: #0f2628`, matching mockup's ~10% contrast approach)
- **Light mode border tokens**: `--border` changed from `#d1d5db` (gray-300) to `#e5e7eb` (gray-200, matching mockup exactly)
- **Dark mode shadow tokens**: Opacity reduced from 0.2-0.3 to 0.1-0.15 (was 3x too heavy)
- **Card hover**: Subtle teal border at 40% opacity instead of full `var(--deveco-teal)`

### Mobile topbar
- Search bar → search icon link on mobile (<768px)
- Create button properly sized
- Actions pushed to right with `margin-left: auto`

### Additional fixes
- ContentTypeBadge: removed border, solid background pills with 3px radius
- SearchSidebar: last offset shadow removed
- ContentCard: hover shadow toned to `--shadow-md`

## Known issues / remaining work

### High priority
1. **CSRF protection** — POST endpoints lack origin/referrer validation
2. **View dedup** — in-memory Map should be Redis for production
3. **`@commonpub/auth` upstream** — should add `additionalFields` for role/username

### Medium priority
4. **Content starter form styling** — cover upload zone needs polish
5. **Federated timeline** — show content from followed remote users
6. **Remote follow button** — UI for following users from other instances
7. **Markdown paste detection** — auto-detect markdown in clipboard, offer to convert (Phase 4 of plan)
8. **Markdown export** — "Export as Markdown" button (Phase 5)

### Low priority
9. **CONTRIBUTING.md** — planned as open source project
10. **GH Actions Node.js 24** — deprecation warning, needs update before June 2026
11. **Docs pipeline test flakiness** — passes in isolation, times out under parallel load
