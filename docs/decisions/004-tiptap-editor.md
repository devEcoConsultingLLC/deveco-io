# ADR-004: TipTap for Rich Text Editing

## Status: Accepted

## Context
Projects need a rich text editor supporting code blocks, images, schematics, and BOM tables.

## Decision
Use TipTap with Vue 3 bindings and custom node views for specialized blocks.

## Rationale
- Native Vue 3 support via `@tiptap/vue-3`
- Built on ProseMirror — mature, extensible
- JSON output stored in PostgreSQL JSONB column
- Custom node views allow domain-specific blocks (code, schematics, BOM)
- Collaborative editing can be added later via Y.js

## Consequences
- Content stored as JSONB, not HTML
- Custom blocks need dedicated Vue components
- Editor bundle size is significant (~200KB gzipped)
