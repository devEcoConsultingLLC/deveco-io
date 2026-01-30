# ADR-002: Vue 3 + Nuxt 3 Over React/Next.js

## Status: Accepted

## Context
Need a modern framework with SSR for SEO, file-based routing, and strong TypeScript support.

## Decision
Use Vue 3 with Nuxt 3.

## Rationale
- SSR built-in with file-based routing
- Server routes eliminate need for separate BFF
- Auto-imports reduce boilerplate
- shadcn-vue port provides accessible components
- TipTap has first-class Vue 3 bindings
- trpc-nuxt provides clean tRPC integration

## Alternatives Considered
- React + Next.js: Larger ecosystem but no significant advantage for this use case
- SvelteKit: Smaller ecosystem, fewer component libraries
