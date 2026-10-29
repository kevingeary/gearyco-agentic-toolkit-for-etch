# Buttons

- Buttons in ACSS almost always use utility classes and don't need custom CSS.
- To make something a button, using the syntax `btn--{color}`.
- There's also an "outline" style variation using the utility class `btn--outline`. The outline class is used in combination with the regular button utility classes, like this: `btn--primary btn--outline`.
- You can also make buttons larger or smaller by using utility classes for size variations. For example, `btn--s` will make the button small. Size variants include xs, s, l, xl, xxl.

## Utility Classes

- IMPORTANT: Always default to using .btn--primary instead of writing CSS to style something like a primary button. Extend this rule to other button styles as well.

<btn-utility-classes>
.btn--primary
.btn--primary-light
.btn--primary-dark
.btn--secondary
.btn--secondary-light
.btn--secondary-dark
.btn--tertiary
.btn--tertiary-light
.btn--tertiary-dark
.btn--accent
.btn--accent-light
.btn--accent-dark
.btn--base
.btn--base-light
.btn--base-dark
.btn--neutral
.btn--neutral-light
.btn--neutral-dark
</btn-utility-classes>

## Button Tokens

If you ever need to create a custom button style but want to reference existing global button values, the following tokens are available:

--btn-padding-block
--btn-padding-inline
--btn-min-width
--btn-width
--btn-line-height
--btn-font-size
--btn-font-weight
--btn-font-family
--btn-font-style
--btn-text-decoration
--btn-text-decoration-hover
--btn-letter-spacing
--btn-text-transform
--btn-border-width
--btn-border-style
--btn-border-radius
--btn-radius
--btn-justify-content
--btn-align-items
--btn-text-align
