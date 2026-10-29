# Automatic.css (ACSS) Rules

Apply these rules ONLY when the project uses Automatic.css.
(Canonical source: the ACSS skill in `etch-middleware`; this file is the
distributable summary. Min ACSS version: `4.0.0-rc-3`.)

## When ACSS is active

- ACSS is available when the Etch plugin reports `integrations.acss.version`.
- If `integrations.acss.version` is missing, **do not assume ACSS is available** —
  fall back to plain CSS.

## Trust the tokens (read first)

- **Assume tokens are configured correctly.** You do NOT need to confirm a
  token's value (its hex, its px, its clamp range) before using it. The site
  owner has already mapped `--primary`, `--bg-dark`, `--text-light`,
  `--space-*`, `--h1`, etc. to the right values. Use them on faith. Never read
  computed values, inspect the DOM, or block on "I can't verify the mapping."
- **Match the design with tokens, not with custom CSS.** When a design shows a
  dark background, light heading, muted body text, generous spacing, etc., reach
  for the semantic/contextual ACSS token that expresses that intent
  (`--bg-dark`, `--text-light`, `--text-light-muted`, `--space-l`). Do not
  reproduce a design by hardcoding the hex/px you see in a screenshot or export.
  Translating a comp's literal values into magic numbers is the wrong instinct
  here — translate them into tokens.
- **Semblance over pixel-perfection.** Your job is to capture the design's
  hierarchy, rhythm, and color relationships using the appropriate tokens — NOT
  to match exact pixel rhythm. If the comp has `88px` top padding, use the
  nearest sensible `--space-*` / `--section-space-*`; do not write
  `to-rem(88px)`. Slight differences from the comp are expected and correct
  because the tokens keep the result responsive and consistent with the rest of
  the site. Pixel-exact magic numbers are a regression, not fidelity.
- This overrides any generic "build exactly what you're shown" instinct: in an
  ACSS project, "build what you're shown" means "express what you're shown with
  the design system," not "hardcode the comp's raw values."

## Output guidance (most important)

- **Variable-first, not utility-first.** Prefer ACSS custom properties
  (`var(--space-m)`, `var(--primary)`) over hard-coded values. ACSS leans on
  tokens far more than utility classes.
- **Use BEM** for class naming much more than utility classes. (Buttons are the
  main utility-class exception — see `acss/buttons.md`.)
- **Never invent ACSS token _names_.** Only use token names that exist in the
  ACSS system (see the `acss/*` references). This is about names, not values —
  you never need to verify a token's configured value (see "Trust the tokens").
  If no token name fits a genuinely one-off need, use a locally-scoped custom
  property (e.g. `--_gap: to-rem(24px)`) — but reach for this rarely, only when
  no semantic ACSS token expresses the intent.
- **Never suggest Tailwind** (classes or workflow).
- **Use logical properties** wherever possible (`max-inline-size` not
  `max-width`, `padding-block`/`padding-inline`, etc.).
- **Don't hardcode** px/hex that duplicates an ACSS token.
- **Don't overuse locally-scoped variables**, and never use them to randomly
  override existing ACSS tokens.

## What's handled globally (write no custom CSS)

Typography, font-family and font properties, links, buttons, blockquotes, borders, section spacing, and content
width are styled globally. Don't redeclare them unless intentionally deviating.

Spacing is **gap-first**; layouts are **mobile-first**; sizing tokens are already
responsive (clamp-based), so breakpoints are rarely needed for sizing.

## CSS reset

A reset is already provided (`@layer etch-reset`). Do not write reset-related CSS
or CSS that assumes no reset exists. Details: `agent-docs/etch-css-reset.md`.

## Topic references — read the relevant file before styling

Authoritative rules live in `agent-docs/acss/`. Open the file that matches:

- **Spacing & gaps:** `agent-docs/acss/spacing.md`
  `--space-*`, `--section-space-*`, `--gutter`, contextual `--content-gap` /
  `--container-gap` / `--grid-gap`, gap-first workflow.
- **Typography:** `agent-docs/acss/typography.md`
  Global heading/text styling, `--h1..--h6`, `--text-xs..--text-xxl`, jump
  sizing, `--heading-*` / `--text-*` style tokens.
- **Colors:** `agent-docs/acss/colors.md`
  Palette (`--primary`…), shades, semantic (`--success`…), contextual
  (`--text-light`, `--bg-dark`…), `--white` / `--black`.
- **Grids / layout:** `agent-docs/acss/grids.md`
  `--grid-1..--grid-12`, ratio grids (`--grid-2-3`), the auto-responsive
  Variable Grid. Grid preferred over flex for structural layout.
- **Widths:** `agent-docs/acss/widths.md`
  `--content-width`, `--width-10..--width-90`, `inline-size: 100%` +
  `max-inline-size` pattern.
- **Borders:** `agent-docs/acss/borders.md`
  `var(--border)`, `var(--radius)`, granular `--border-size/style/color-*`.
- **Buttons:** `agent-docs/acss/buttons.md`
  `btn--{color}`, `btn--outline`, size variants, `--btn-*` tokens.
- **Blockquotes:** `agent-docs/acss/blockquotes.md`
  Global styling + required DOM structure + `--blockquote-*` overrides.
- **Links:** `agent-docs/acss/links.md`
  Global link styling + `--link-*` tokens for custom cases.

## ACSS import files

- Never change the **neutral** palette (`neutral-*` keys) when generating an
  ACSS import. Leave every neutral value exactly as it is in the source file.
- Only enable the palette colors the design actually uses. Don't fill extra
  slots (secondary, tertiary, accent) by duplicating another color — turn them
  off (`option-{color}-clr`, plus their `-trans` options) instead. Status colors
  (success, danger, warning, info) stay off unless the design uses them.
- Only enable the button styles the design actually uses
  (`option-{color}-btn`, `-btn-outline`, `-btn-shades`); turn the rest off.
- Point contextual settings that name a color (e.g. `bg-light-button`,
  `card-button-style`, form button styles) at an enabled color only.
- Body and muted text reference the **base** color, not neutral.
- Keep color configuration logical: a "dark" token must always render dark and
  a "light" token light. For light-only sites set `auto-color-scheme` to `off`
  so ACSS doesn't generate inverted dark-mode alternates (which make
  `--base-dark` render light and `--white` render black in a dark UI).

## Quick do / don't

Do
- `gap: var(--content-gap)`, `padding: var(--space-l)`, `color: var(--text-light)`
- `grid-template-columns: var(--grid-3)`
- `max-inline-size: var(--width-60)` (logical properties)
- `border: var(--border); border-radius: var(--radius)`
- BEM class names; `btn--primary` for buttons

Don't
- `padding: 40px`, `color: #1a1a1a`, `grid-template-columns: repeat(3, 1fr)`
- `max-width` instead of `max-inline-size`
- Invent token names you can't confirm
- Tailwind classes or workflow
- Manual padding on section elements / random container `max-width`
- `font-size` on headings/text unless intentionally deviating
- Reset-related CSS (already provided)
