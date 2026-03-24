# devEco.io Deployment Plan

## Architecture Overview

Single DigitalOcean droplet running Docker Compose with Caddy as the reverse proxy. Managed PostgreSQL for data safety. Spaces for file uploads. Free DNS.

```
                    ┌─────────────────────────┐
                    │   DigitalOcean DNS       │
                    │   deveco.io → Droplet IP │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Droplet (s-2vcpu-2gb)   │
                    │  $18/mo                  │
                    │                          │
                    │  ┌─────────────────────┐ │
                    │  │ Caddy :80/:443      │ │
                    │  │ Auto TLS + Proxy    │ │
                    │  └──────────┬──────────┘ │
                    │             │             │
                    │  ┌──────────▼──────────┐ │
                    │  │ Nuxt 3 App :3000    │ │
                    │  └──────────┬──────────┘ │
                    │             │             │
                    │  ┌──────────┴──────────┐ │
                    │  │ Redis :6379         │ │
                    │  │ Meilisearch :7700   │ │
                    │  └─────────────────────┘ │
                    └──────────┬───────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼───────┐ ┌──────▼──────┐
    │ Managed PG 16  │ │   Spaces     │ │  Container  │
    │ $15/mo         │ │   $5/mo      │ │  Registry   │
    │ Auto backups   │ │   CDN incl.  │ │  Free tier  │
    └────────────────┘ └──────────────┘ └─────────────┘
```

**Monthly cost: ~$38/mo**

| Resource | Spec | Cost |
|----------|------|------|
| Droplet | `s-2vcpu-2gb` (2 vCPU, 2 GB RAM, 60 GB) | $18/mo |
| Managed PostgreSQL 16 | `db-s-1vcpu-1gb` (single node, auto backups) | $15/mo |
| Spaces (file uploads) | 250 GB storage, 1 TB transfer, CDN included | $5/mo |
| DNS | Free | $0 |
| Firewall | Free | $0 |
| Container Registry | Free tier (500 MB, 1 repo) | $0 |
| **Total** | | **$38/mo** |

---

## Prerequisites

```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init  # paste API token from DO dashboard

# Verify
doctl account get
```

---

## 1. Provision Infrastructure

### Create SSH key

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deveco-do -C "deveco-deploy"
SSH_KEY_ID=$(doctl compute ssh-key create deveco-key \
  --public-key "$(cat ~/.ssh/deveco-do.pub)" \
  --format ID --no-header)
```

### Create the droplet

```bash
doctl compute droplet create deveco-app \
  --size s-2vcpu-2gb \
  --image ubuntu-24-04-x64 \
  --region nyc3 \
  --ssh-keys $SSH_KEY_ID \
  --enable-monitoring \
  --enable-ipv6 \
  --tag-names "web,deveco" \
  --wait

DROPLET_IP=$(doctl compute droplet get deveco-app --format PublicIPv4 --no-header)
DROPLET_IPV6=$(doctl compute droplet get deveco-app --format PublicIPv6 --no-header)
echo "Droplet IP: $DROPLET_IP"
```

### Create managed PostgreSQL

```bash
DB_ID=$(doctl databases create deveco-pg \
  --engine pg \
  --version 16 \
  --size db-s-1vcpu-1gb \
  --region nyc3 \
  --num-nodes 1 \
  --wait \
  --format ID --no-header)

# Restrict access to our droplet only
doctl databases firewalls append $DB_ID --rule tag:web

# Get connection string
DATABASE_URL=$(doctl databases connection $DB_ID --format URI --no-header)
echo "DATABASE_URL: $DATABASE_URL"
```

### Create Spaces bucket

```bash
# Spaces keys — create via DO dashboard: API > Spaces Keys
# Then configure s3cmd or use the DO console

# Using AWS CLI (works with Spaces)
aws s3 mb s3://deveco-uploads \
  --endpoint-url https://nyc3.digitaloceanspaces.com \
  --region us-east-1
```

### Create container registry

```bash
doctl registry create deveco --subscription-tier starter
doctl registry login
```

### Set up firewall

```bash
doctl compute firewall create \
  --name "deveco-fw" \
  --inbound-rules "protocol:tcp,ports:22,address:YOUR_HOME_IP/32 protocol:tcp,ports:80,address:0.0.0.0/0 protocol:tcp,ports:443,address:0.0.0.0/0 protocol:tcp,ports:80,address:::/0 protocol:tcp,ports:443,address:::/0" \
  --outbound-rules "protocol:tcp,ports:all,address:0.0.0.0/0 protocol:udp,ports:all,address:0.0.0.0/0 protocol:icmp,address:0.0.0.0/0 protocol:tcp,ports:all,address:::/0 protocol:udp,ports:all,address:::/0 protocol:icmp,address:::/0" \
  --tag-names "web"
```

> Replace `YOUR_HOME_IP/32` with your actual IP. Update it when your IP changes.

---

## 2. DNS Records

Point your registrar's nameservers to:
- `ns1.digitalocean.com`
- `ns2.digitalocean.com`
- `ns3.digitalocean.com`

Then create records:

```bash
doctl compute domain create deveco.io

# A records (root)
doctl compute domain records create deveco.io \
  --record-type A --record-name @ --record-data $DROPLET_IP --record-ttl 1800

# AAAA record (IPv6)
doctl compute domain records create deveco.io \
  --record-type AAAA --record-name @ --record-data $DROPLET_IPV6 --record-ttl 1800

# www → root redirect (CNAME)
doctl compute domain records create deveco.io \
  --record-type CNAME --record-name www --record-data deveco.io. --record-ttl 3600

# CAA record (only Let's Encrypt can issue certs)
doctl compute domain records create deveco.io \
  --record-type CAA --record-name @ --record-data '0 issue "letsencrypt.org"' --record-ttl 3600
```

---

## 3. Caddyfile

```
# /opt/deveco/Caddyfile

deveco.io {
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        -Server
    }

    # SSE endpoints — disable buffering
    handle /api/notifications* {
        reverse_proxy app:3000 {
            flush_interval -1
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    # All other routes
    handle {
        reverse_proxy app:3000 {
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    log {
        output file /var/log/caddy/deveco.log {
            roll_size 50MiB
            roll_keep 5
            roll_keep_for 720h
        }
        format json
    }
}

www.deveco.io {
    redir https://deveco.io{uri} permanent
}
```

Caddy handles TLS automatically:
- Obtains Let's Encrypt cert on first request (HTTP-01 challenge)
- Auto-renews ~30 days before expiry
- OCSP stapling enabled by default
- HTTP/2 and HTTP/3 (QUIC) enabled by default
- All HTTP traffic redirected to HTTPS automatically

---

## 4. Docker Compose (Production)

```yaml
# /opt/deveco/docker-compose.yml

services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"   # HTTP/3
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app

  app:
    image: registry.digitalocean.com/deveco/deveco-app:latest
    restart: unless-stopped
    expose:
      - "3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
      - NUXT_HOST=0.0.0.0
      - NUXT_PORT=3000
    depends_on:
      redis:
        condition: service_healthy
      meilisearch:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    expose:
      - "6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  meilisearch:
    image: getmeili/meilisearch:v1.12
    restart: unless-stopped
    expose:
      - "7700"
    environment:
      - MEILI_ENV=production
      - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
      - MEILI_NO_ANALYTICS=true
    volumes:
      - meili_data:/meili_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  caddy_data:      # TLS certs — DO NOT lose this
  caddy_config:
  redis_data:
  meili_data:
```

---

## 5. Dockerfile

```dockerfile
# /opt/deveco/Dockerfile

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 6. Environment Variables

### Required in production `.env`

```bash
# ── Database ──
NUXT_DATABASE_URL=postgresql://user:pass@deveco-pg-do-user-xxxxx-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require

# ── Auth ──
NUXT_AUTH_SECRET=<generate: openssl rand -base64 32>
NUXT_PUBLIC_SITE_URL=https://deveco.io

# ── File Storage (DO Spaces) ──
NUXT_STORAGE_ADAPTER=s3
NUXT_SPACES_KEY=<spaces-access-key>
NUXT_SPACES_SECRET=<spaces-secret-key>
NUXT_SPACES_BUCKET=deveco-uploads
NUXT_SPACES_REGION=nyc3
NUXT_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
NUXT_SPACES_CDN_URL=https://deveco-uploads.nyc3.cdn.digitaloceanspaces.com

# ── Search ──
NUXT_MEILI_HOST=http://meilisearch:7700
NUXT_MEILI_API_KEY=${MEILI_MASTER_KEY}
MEILI_MASTER_KEY=<generate: openssl rand -base64 32>

# ── Redis ──
NUXT_REDIS_URL=redis://redis:6379

# ── Email (pick one) ──
NUXT_EMAIL_ADAPTER=resend
NUXT_RESEND_API_KEY=re_xxxxxxxx
NUXT_RESEND_FROM=noreply@deveco.io

# ── Instance ──
NUXT_PUBLIC_SITE_NAME=devEco.io
NUXT_PUBLIC_SITE_DESCRIPTION=Build Edge AI Projects That Matter
```

### Local dev `.env`

```bash
NUXT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deveco
NUXT_AUTH_SECRET=dev-secret-change-me
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_EMAIL_ADAPTER=console
NUXT_REDIS_URL=redis://localhost:6379
NUXT_MEILI_HOST=http://localhost:7700
NUXT_MEILI_API_KEY=dev-meili-key
```

---

## 7. Deploy Script

```bash
#!/bin/bash
# deploy.sh — build, push, restart on droplet
set -euo pipefail

REGISTRY=registry.digitalocean.com/deveco
IMAGE=$REGISTRY/deveco-app
TAG=$(git rev-parse --short HEAD)

echo "Building $IMAGE:$TAG..."
docker build -t $IMAGE:$TAG -t $IMAGE:latest .

echo "Pushing..."
docker push $IMAGE:$TAG
docker push $IMAGE:latest

echo "Deploying to droplet..."
ssh deveco-app "cd /opt/deveco && \
  docker compose pull app && \
  docker compose up -d app && \
  docker image prune -f"

echo "Deployed $TAG"
```

---

## 8. Scaling Path

| When | Action | New Cost |
|------|--------|----------|
| **Now** | Single droplet + managed PG | $38/mo |
| **~100 DAU** | Upgrade to `s-2vcpu-4gb` droplet | $44/mo |
| **~500 DAU** | Add managed Valkey for Redis HA | $59/mo |
| **~1k DAU** | Add load balancer + 2nd droplet | $77/mo |
| **~5k DAU** | Upgrade PG to 2-node HA | $122/mo |
| **~10k DAU** | Separate Meilisearch droplet, scale app horizontally | ~$150/mo |

Scaling is additive — you never re-architect, just add resources.

---

## 9. First-Time Setup on Droplet

```bash
# SSH in
ssh -i ~/.ssh/deveco-do root@$DROPLET_IP

# Install Docker
curl -fsSL https://get.docker.com | sh

# Login to DO container registry
doctl registry login

# Create app directory
mkdir -p /opt/deveco
cd /opt/deveco

# Copy docker-compose.yml, Caddyfile, .env (via scp or git)
# Then:
docker compose up -d

# Run database migrations
docker compose exec app node .output/server/index.mjs migrate
# (or however your Drizzle migrations are triggered)

# Verify
docker compose logs -f
curl -I https://deveco.io
```

---

## 10. Backup Strategy

- **PostgreSQL**: Managed DB includes daily automatic backups + point-in-time recovery (7-day window). No action needed.
- **Spaces**: S3-compatible, inherently durable (3x replication). No additional backup needed.
- **Redis**: Ephemeral cache — no backup needed. Data reconstructed on restart.
- **Meilisearch**: Rebuild index from PostgreSQL. Add a cron job if index is expensive:
  ```bash
  # Weekly dump
  0 3 * * 0 docker compose exec meilisearch meilisearch-dump create
  ```
- **Caddy data** (`caddy_data` volume): Contains TLS certs. Back up to avoid rate-limit issues on rebuild:
  ```bash
  docker run --rm -v deveco_caddy_data:/data -v /backup:/backup alpine tar czf /backup/caddy-data.tar.gz /data
  ```
