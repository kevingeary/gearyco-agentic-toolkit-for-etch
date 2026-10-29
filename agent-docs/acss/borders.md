# Borders

ACSS has a global border system that handles most border styling automatically and consistently across the site.

## Radius

Border radius should always be applied with `var(--radius)`. This is the global radius value used across the site.

## Border Style

What you need to know: Use var(--border) whenever you need to add a border.

In situations where you need a custom border, but some of the properties should retain global values, you can mix and match the granular border tokens:

Border Width via `var(--border-size)`
Border Style via `var(--border-style)`
Border Color via `var(--border-color-light)` or `var(--border-color-dark)`

Here's an example of a box with default border styling:

<example>
.box {
	border: var(--border);
	border-radius: var(--radius);
}
</example>
