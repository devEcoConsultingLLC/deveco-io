# ADR-003: Tailwind v4 with CSS Variable Tokens

## Status: Accepted

## Context
Need a styling approach that supports a custom brand design system with dark mode.

## Decision
Use Tailwind CSS v4 with `@theme` CSS variable tokens matching the mockup design system.

## Rationale
- CSS-first configuration in v4 maps directly to design tokens
- Same CSS variable approach used by shadcn/ui theming
- Dark mode via class toggle + variable overrides
- Brand colors (pink, yellow, teal, blue) stay constant across themes
- Semantic tokens (`bg-primary`, `text-foreground`) auto-adapt

## Consequences
- All components must use semantic token classes, never hardcoded hex
- Theme is defined in `apps/web/assets/css/main.css`
