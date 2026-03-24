# devEco.io

Edge AI project sharing and community platform. Backed by Edge AI Foundation.

Built with [CommonPub](https://commonpub.dev).

## Features

- **Projects**: Document and share edge AI builds with rich block editors
- **Blog**: Publish posts, tutorials, and findings
- **Communities**: Create and join hubs for collaboration
- **Contests**: Staff-managed build competitions with judging

## Development

```bash
docker compose up -d    # Start Postgres, Redis, Meilisearch
pnpm install
pnpm db:push            # Push schema to database
pnpm dev                # Start Nuxt dev server
```

## License

AGPL-3.0-only
