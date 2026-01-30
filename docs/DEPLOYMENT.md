# Deployment

## Production Architecture

```
Internet --> nginx (:80/:443, SSL via Let's Encrypt)
               ├── Nuxt container (:3000)
               ├── Fastify API container (:3001)
               ├── PostgreSQL container (:5432)
               ├── Meilisearch container (:7700)
               ├── Redis container (:6379)
               └── DO Spaces (external S3-compatible file storage)
```

## DigitalOcean Droplet Setup

### Requirements
- 4GB RAM / 2 vCPU Droplet ($24/mo)
- DigitalOcean Spaces ($5/mo)
- Domain pointed to Droplet IP

### Initial Setup

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
apt install docker-compose-plugin

# Clone repo
git clone https://github.com/edge-ai-foundation/deveco-io.git /opt/deveco
cd /opt/deveco

# Configure environment
cp .env.example .env
# Edit .env with production values

# Build and start
docker compose -f docker/docker-compose.prod.yml up -d

# Run migrations
docker compose exec web pnpm db:migrate
```

### SSL with Let's Encrypt

```bash
apt install certbot
certbot certonly --standalone -d deveco.io -d www.deveco.io
# Then uncomment SSL section in docker/nginx/nginx.conf
```

### Estimated Monthly Cost

| Service | Cost |
|---------|------|
| DO Droplet (4GB/2vCPU) | $24/mo |
| DO Spaces (250GB + CDN) | $5/mo |
| **Total** | **~$29/mo** |
