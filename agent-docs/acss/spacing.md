# spacing

## Spacing Tokens

Use tokens for all spacing with the syntax `{space}-{size}` with xs, s, m, l, xl, xxl as options.

This spacing is automatically responsive as it uses clamp functions as values.

Additionally, if you need spacing that scales aggressively or very specifically, you can use the syntax `{space}-{size}-to-{size}` such as `var(--space-xxl-to-m)`. This will scale the spacing from the max value of the first size to the min value of the second size.

You do not need to change spacing at breakpoints in ACSS. Always use responsive tokens.

## Section Spacing Tokens

Section spacing uses special section spacing tokens with the syntax `{section-space}-{size}` and `{section-space}-{size}-to-{size}`.

You do not need to change spacing at breakpoints in ACSS. Always use responsive tokens.

## Default Section Spacing

ACSS already handles section spacing automatically on section elements. You should never apply manual padding-block or padding-inline on section elements.

## Gutter

Inline section padding always uses the token `var(--gutter)`. Whenever you need to produce a gutter for the site (space between content and edge of device), use this token. But this should only be needed in very rare instances as this token is applied automatically to top level sections and doesn't need to be referenced manually.

## Gap First Workflow & Margin Rules

ACSS uses a gap-first workflow. That means gap is the preferred method of creating space between elements. You should default to using flex or grid layouts/alignments and gap rather than trying to use margin to space elements away from one another.

In addition to this philosophy, ACSS provides important contextual spacing tokens:

- `var(--content-gap)`: The gap between standard content in the layout.
- `var(--container-gap)`: The gap between containers (direct inner child div of a section) in a section.
- `var(--grid-gap)`: The gap between items in a grid layout.

Use these contextual spacing tokens whenever possible.

Only use margin rarely when it doesn't make sense to use gap or when gap was used for consistent spacing and you need to space something inconsistently as an additive to the existing gap.

You can still use the gap tokens with the margin property in scenarios where it makes sense to do so.

## Padding

Padding should never use contextual gap tokens. Always use normal spacing tokens.
