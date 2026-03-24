# devEco.io

The open platform for Edge AI projects, hardware, and communities. Built by developers, for developers.

**Live at [deveco.io](https://deveco.io)** | Backed by [Edge AI Foundation](https://edgeaifoundation.org) | Part of the [Internet of Communities](https://thedeveco.com/community)

Built on [CommonPub](https://github.com/commonpub/commonpub) — an open ActivityPub federation protocol for self-hosted maker communities.

## Features

- **Projects** — Document edge AI builds with a block editor: parts lists, build steps, code blocks, galleries, and more
- **Blog** — Publish posts, tutorials, and findings with rich formatting
- **Communities** — Create and join hubs for collaboration, discussions, and project sharing
- **Contests** — Staff-managed build competitions with submissions and judging
- **Federation** — ActivityPub protocol support for cross-instance content sharing
- **Search** — Full-text search powered by Meilisearch
- **File uploads** — S3-compatible storage (DigitalOcean Spaces, AWS S3, MinIO)
- **Email** — Transactional email via Resend, SMTP, or console (dev)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 3](https://nuxt.com) (Vue 3, SSR) |
| Auth | [Better Auth](https://better-auth.com) |
| Database | PostgreSQL 16 + [Drizzle ORM](https://orm.drizzle.team) |
| Editor | [TipTap](https://tiptap.dev) block editor |
| Search | [Meilisearch](https://meilisearch.com) |
| Storage | S3-compatible (DO Spaces, AWS S3, MinIO) or local filesystem |
| Cache | Redis / Valkey |
| Reverse Proxy | [Caddy](https://caddyserver.com) (auto TLS) |
| CI/CD | GitHub Actions → DigitalOcean |
| Packages | [@commonpub/*](https://github.com/commonpub/commonpub) npm packages |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker (for local Postgres, Redis, Meilisearch)

### Development Setup

```bash
# Clone the repo
git clone https://github.com/devEcoConsultingLLC/deveco-io.git
cd deveco-io

# Start infrastructure
docker compose up -d    # Postgres, Redis, Meilisearch

# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start dev server
pnpm dev                # http://localhost:3000
```

The first registered user is automatically promoted to admin in dev mode.

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
NUXT_DATABASE_URL=postgresql://commonpub:commonpub_dev@localhost:5432/commonpub

# Auth
NUXT_AUTH_SECRET=dev-secret-change-me
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (console | resend | smtp)
NUXT_EMAIL_ADAPTER=console

# File storage (optional — defaults to local ./uploads)
# S3_BUCKET=your-bucket
# S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
# S3_ACCESS_KEY=...
# S3_SECRET_KEY=...
# S3_PUBLIC_URL=https://your-bucket.nyc3.cdn.digitaloceanspaces.com

# Search
NUXT_MEILI_HOST=http://localhost:7700
NUXT_MEILI_API_KEY=commonpub_dev_key

# Redis
NUXT_REDIS_URL=redis://localhost:6379

# Feature flags
FEATURE_CONTENT=true
FEATURE_SOCIAL=true
FEATURE_HUBS=true
FEATURE_CONTESTS=true
FEATURE_ADMIN=true
FEATURE_FEDERATION=true
```

## Project Structure

```
deveco-io/
  assets/deveco-theme.css     # devEco theme overrides (colors, fonts, shape)
  components/                 # Vue components
    editors/                  # Block editor components
    blocks/                   # Content block renderers
    views/                    # Content type view pages
  composables/                # Vue composables (auth, editor, save, validation)
  layouts/                    # Page layouts (default, auth, editor)
  pages/                      # File-based routing (Nuxt 3)
  server/                     # Nitro API routes + middleware
    api/                      # REST API endpoints
    middleware/                # Auth, security, feature flags
    plugins/                  # Server plugins (auto-admin)
    utils/                    # DB, config, auth helpers
  deploy/                     # Production Docker Compose + Caddyfile
  docs/                       # Documentation
    deployment.md             # Production deployment guide
    handoffs/                 # Session handoff notes
  public/                     # Static assets
  Dockerfile                  # Multi-stage production build
  docker-compose.yml          # Local dev infrastructure
  commonpub.config.ts         # Feature flags + instance config
  drizzle.config.ts           # Database schema config
  nuxt.config.ts              # Nuxt configuration
```

## Architecture

devEco.io is a **Nuxt 3 SSR application** that consumes `@commonpub/*` npm packages for its backend functionality. It is not a monorepo — all shared logic lives in the [CommonPub](https://github.com/commonpub/commonpub) project.

### Key Packages

| Package | Purpose |
|---------|---------|
| `@commonpub/schema` | Drizzle tables + Zod validators |
| `@commonpub/server` | Business logic (content CRUD, hubs, social) |
| `@commonpub/auth` | Better Auth wrapper + session management |
| `@commonpub/editor` | TipTap extensions + BlockTuple serialization |
| `@commonpub/ui` | Headless Vue 3 components + theme CSS |
| `@commonpub/infra` | Storage adapters, image processing, email |
| `@commonpub/config` | Feature flag configuration |

### Design System

devEco uses a custom theme layer (`assets/deveco-theme.css`) on top of CommonPub's base design system:

- **Colors**: Dark green `#004e53` primary, light green `#00e7ad` accent
- **Typography**: Poppins (body), Nunito (display), JetBrains Mono (code)
- **Shape**: Rounded corners (6-14px), 1px borders, soft shadows
- **Dark mode**: Teal-tinted dark surfaces (supported via CSS custom properties)

## Deployment

See [docs/deployment.md](docs/deployment.md) for the full production deployment guide.

### Quick Deploy

```bash
# Build production Docker image
docker build -t deveco-app .

# Run with Docker Compose
cd deploy
docker compose -f docker-compose.prod.yml up -d
```

### Auto-Deploy

Push to `main` triggers GitHub Actions:
1. Builds Docker image on GitHub runners
2. Pushes to DigitalOcean Container Registry
3. SSHs into production droplet to pull and restart

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repo
2. Create a feature branch (`feat/my-feature`)
3. Make your changes
4. Run `pnpm nuxt typecheck` to verify types
5. Submit a PR with a clear description

### Code Style

- Vue 3 Composition API with `<script setup lang="ts">`
- CSS custom properties only — no hardcoded colors/fonts
- Component class prefix: `de-` (devEco-specific) or `cpub-` (CommonPub shared)
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`

## License

[AGPL-3.0-only](LICENSE)

---

**devEco.io** is a project of [devEco Consulting LLC](https://thedeveco.com), backed by [Edge AI Foundation](https://edgeaifoundation.org).
