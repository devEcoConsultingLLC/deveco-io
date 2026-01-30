# ADR-001: Monorepo Structure

## Status: Accepted

## Context
We need to manage multiple packages (frontend, API, database, auth, UI components, tRPC routers) in a coordinated way.

## Decision
Use Turborepo + pnpm workspaces with 7 packages under `apps/` and `packages/`.

## Consequences
- Single repo for all code — easier onboarding
- pnpm workspace protocol for local package linking
- Turborepo handles build ordering and caching
- Contributors need pnpm >= 9 installed
