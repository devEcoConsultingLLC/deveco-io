# API Documentation

## Public REST API

Base URL: `http://localhost:3001` (dev) / `https://api.deveco.io` (prod)

Swagger UI available at `/docs`.

### Endpoints

#### Projects
- `GET /api/v1/projects` — List published projects
- `GET /api/v1/projects/:slug` — Get project by slug

#### Hardware
- `GET /api/v1/hardware` — List hardware items
- `GET /api/v1/hardware/:slug` — Get hardware item by slug

#### Contests
- `GET /api/v1/contests` — List contests
- `GET /api/v1/contests/:slug` — Get contest by slug

#### Communities
- `GET /api/v1/communities` — List communities
- `GET /api/v1/communities/:slug` — Get community by slug

#### Users
- `GET /api/v1/users/:username` — Get public user profile

#### Search
- `GET /api/v1/search?q=query` — Search projects and hardware

### Query Parameters

Most list endpoints support:
- `limit` (integer, 1-50, default: 20)
- `offset` (integer, default: 0)
- Endpoint-specific filters (see Swagger docs)

### Rate Limiting

- 100 requests per minute per IP
- Rate limit headers included in responses

## Internal tRPC API

Used by the Nuxt frontend. Type-safe, not intended for third-party use.

Endpoint: `/api/trpc/*`

Routers: `project`, `user`, `contest`, `hardware`, `community`, `comment`, `search`, `upload`, `tag`
