# Contributing to devEco.io

## Getting Started

1. Fork the repository
2. Follow the [Setup Guide](./SETUP.md)
3. Create a feature branch from `develop`
4. Make your changes
5. Submit a pull request

## Code Style

- TypeScript strict mode everywhere
- Vue components use `<script setup lang="ts">`
- Follow existing patterns in each package
- Use semantic color tokens, never hardcode hex values in templates

## Branch Strategy

- `main` — production releases
- `develop` — integration branch
- `feature/*` — feature branches (from develop)
- `fix/*` — bug fix branches (from develop)

## Commit Messages

Use conventional commits:

```
feat: add hardware comparison view
fix: correct search indexing for special characters
docs: update API documentation
refactor: extract upload logic to composable
```

## Architecture Rules

- Database schema only in `packages/db/src/schema/`
- Business logic in tRPC routers (`packages/trpc/src/router/`)
- Shared Vue components in `packages/ui/`
- App-specific components in `apps/web/components/`
- File uploads use presigned URLs — never stream through the app server

## License

All contributions must be compatible with AGPL-3.0-only.
