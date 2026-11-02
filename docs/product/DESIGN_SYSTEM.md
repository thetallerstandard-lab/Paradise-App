# Design system

**Status: Implemented (tokens + base components), not visually verified.**
Source of truth: `src/app/globals.css`, `src/components/ui/*`.

## Personality

Grounded, trustworthy, crafted. Think well-made tools and a good shop sign — not a tech startup.

## Colour tokens

| Token | Light | Use |
| --- | --- | --- |
| Deep forest green `forest-900` | `#12301f` | Primary actions, headings accent |
| Forest scale | `950 #0c1f17`, `800 #1a4230`, `700 #22573f`, `100 #dfe9e2` | Dark surfaces, tints |
| Warm ivory `ivory-50/100/200` | `#fbf8f1` / `#f5f0e4` / `#ebe3d0` | Page background, muted, secondary |
| Charcoal `charcoal-950/900/700/500` | `#16181a` / `#222528` / `#3d4246` / `#5f666b` | Text |
| Muted brass `brass-600/500/300` | `#8a6d2f` / `#a8873f` / `#d3bd85` | Accents, focus ring, highlights |

Semantic tokens (`background`, `foreground`, `primary`, `muted-foreground`, `border`, `ring`, …)
map onto these for shadcn/ui and switch automatically in dark mode (`prefers-color-scheme`).

### Accessibility (computed contrast, WCAG 2.1)

| Pair | Ratio | Passes |
| --- | --- | --- |
| Charcoal-950 on ivory-50 (body text) | 16.78:1 | AAA |
| Charcoal-500 on ivory-50 / ivory-100 (muted text) | 5.50:1 / 5.13:1 | AA |
| Ivory-50 on forest-900 (primary button) | 13.48:1 | AAA |
| Brass-600 on ivory-50 / white card | 4.59:1 / 4.87:1 | AA (normal text) |
| Brass-500 on ivory-50 | 3.19:1 | Large text / non-text only |
| Charcoal-950 on brass-500 (accent button) | 5.26:1 | AA |
| White on destructive `#b42318` | 6.57:1 | AA |
| Dark: ivory-100 on forest-950 | 15.09:1 | AAA |
| Dark: muted `#b9c4bc` on forest-950 / forest-800 | 9.55:1 / 6.26:1 | AA+ |
| Dark: brass-300 on forest-950 | 9.30:1 | AAA |

Rule: use `brass` (600 in light) for text; `accent` (brass-500) only for fills with charcoal text.
Ratios computed from the token hex values with the WCAG 2.1 luminance formula; confirm in the
rendered app with an automated check (axe) once it runs.

## Typography

Inter (`font-sans`) for UI and body; Source Serif 4 (`font-serif`) for display headings. Loaded via `next/font`.

## Components

shadcn/ui (new-york): `Button` (default, accent, destructive, outline, secondary, ghost, link),
`Card`, `Badge` (default, secondary, brass, outline), `Input`, `Label`. Layout: `Container`,
`SiteHeader`, `SiteFooter`, `Wordmark`. Add more with `npx shadcn@latest add <name>`.

## Layout rules

Mobile-first. 16px side gutter on phones (`Container`). Touch targets ≥ 40px (`h-10` default buttons).
No horizontal scroll at 360px width (covered by an e2e test).
