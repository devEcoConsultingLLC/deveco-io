# Setup Guide

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker and Docker Compose

## Quick Start

```bash
# Clone the repo
git clone https://github.com/edge-ai-foundation/deveco-io.git
cd deveco-io

# Copy environment variables
cp .env.example .env

# Start infrastructure services
docker compose -f docker/docker-compose.yml up -d

# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm db:seed

# Start the dev server
pnpm dev --filter web
```

The app will be available at `http://localhost:3000`.

## Services

| Service | URL | Purpose |
|---------|-----|---------|
| Nuxt App | http://localhost:3000 | Web application |
| Fastify API | http://localhost:3001 | Public REST API |
| PostgreSQL | localhost:5432 | Database |
| MinIO Console | http://localhost:9001 | File storage admin |
| MinIO API | http://localhost:9000 | S3-compatible storage |
| Meilisearch | http://localhost:7700 | Search engine |
| Redis | localhost:6379 | Session store, caching |

## Common Commands

```bash
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Drizzle Studio
```
