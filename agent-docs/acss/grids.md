# Grids (Layout)

Use grid tokens and other ACSS grid workflows whenever possible. In general CSS Grid is preferred over Flexbox for structural layouts.

## Standard Symmetrical Grids

Use the syntax `var(--grid-{col-count})`.

Available Options:

--grid-1
--grid-2
--grid-3
--grid-4
--grid-5
--grid-6
--grid-7
--grid-8
--grid-9
--grid-10
--grid-11
--grid-12

Bad example: grid-template-columns: repeat(3, 1fr);
Good example: grid-template-columns: var(--grid-3);

## Standard Non-Symmetrical Grids

Use the syntax `var(--grid-{ratio})`. Example `var(--grid-2-3)` for a two column grid that's 2 parts to 3 parts.

Available options:

--grid-1-2
--grid-1-3
--grid-2-1
--grid-2-3
--grid-3-1
--grid-3-2

These should be used in mobile first media queries to reduce CSS.

Bad example: grid-template-columns: 1fr 2fr;
Good example: grid-template-columns: var(--grid-1-2);

## Making Responsive Layouts with Grid Tokens

You should use mobile first media queries by default to reduce CSS and complexity.

Bad Example:

`.bad-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
@media (max-width: 768px) {
grid-template-columns: 1fr;
}
}`

Good Example:

`.good-grid {
display: grid;
@media (min-width: to-rem(768px)) {
grid-template-columns: var(--grid-3);
}
}`

## Variable Grids

Variable Grid is a unique, powerful, lightweight, automatically responsive grid system.

In our Variable Grid system, grid cells stack automatically when items in the grid are squeezed to their minimum allowed width. Instead of the grid responding to a specific device size, it responds only to the current width of its children.

<variable-grid-css>
--min: to-rem(350px); /* Min item width */
display: grid !important;
grid-template-columns: repeat(auto-fit, minmax(min(var(--min), 100%), 1fr));
grid-template-rows: 1fr;
gap: var(--grid-gap, 1em);
</variable-grid-css>

Use this grid system when a specific number of columns is not required and it makes sense for the grid to stack according to a minimum element size rather than a specific screen or device size.
