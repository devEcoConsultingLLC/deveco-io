# ADR-005: Better Auth for Authentication

## Status: Accepted

## Context
Need self-hosted authentication with email/password and OAuth providers (GitHub, Google).

## Decision
Use Better Auth with a Nuxt plugin.

## Rationale
- Open source, self-hosted — no vendor lock-in
- Plugin architecture for extensibility
- Supports email/password + social providers
- Session management with configurable expiry
- Works with PostgreSQL directly

## Alternatives Considered
- NextAuth/Auth.js: React-focused, Vue adapter less mature
- Lucia Auth: Deprecated in favor of Better Auth
- Custom auth: Too much security surface area to maintain
