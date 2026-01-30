# Design System

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Dark Green | `#004e53` | Primary brand, dark backgrounds |
| Light Green | `#00e7ad` | Accent, CTAs, secondary brand |
| Pink | `#e85a85` | Highlights, contest badges |
| Yellow | `#f4c84b` | Warnings, contest badges |
| Teal | `#4db3a8` | Success states, logo element |
| Teal Light | `#6ab4a8` | Logo element |
| Blue | `#5bc5e8` | Info, links, logo element |
| Purple | `#5f2bef` | Premium features |
| Dark Blue | `#1b357d` | Gradient backgrounds |
| Aqua | `#42fffe` | Special accents |
| Portal Purple | `#5865F2` | portalNetwork branding |

## Typography

| Family | Weight | Usage |
|--------|--------|-------|
| Poppins | 400-800 | Body text, UI elements |
| Nunito | 700-900 | Display headings (h1, hero) |
| JetBrains Mono | 400-500 | Code blocks, monospace |

## Semantic Tokens

All components use semantic tokens that auto-adapt to light/dark mode:

- `bg-primary`, `text-primary-foreground` — primary actions
- `bg-secondary`, `text-secondary-foreground` — secondary actions
- `bg-card`, `text-card-foreground` — card surfaces
- `bg-muted`, `text-muted-foreground` — subdued elements
- `bg-background`, `text-foreground` — page defaults
- `border-border` — borders
- `bg-destructive` — error states

## Dark Mode

Class-based toggle (`<html class="dark">`). The `useTheme` composable manages preference with localStorage persistence and `prefers-color-scheme` as default.

## Components

shadcn-vue components live in `packages/ui/src/components/`. Custom brand button variants: `accent`, `pink`, `yellow`, `blue`.

## Logo

The DevEcoLogo component preserves exact SVG coordinates from the mockups. Three variants: `light-bg`, `dark-bg`, `gradient-bg`. Animated variants: `breathe`, `pulse`, `glow`, `float`.
