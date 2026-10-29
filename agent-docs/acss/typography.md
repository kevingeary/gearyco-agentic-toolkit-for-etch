# Typography

## Heading & Text Styles

Headings are text are all styled globally and don't need custom CSS unless it's text or a heading that looks fundamentally different from default/global text styles.

All of the following is handled globally and does not need manual CSS:

- Size (Automatically responsive)
- Line Height
- Font Family
- Color
- Weight
- Letter Spacing
- Font Style
- Text Transform
- Text Wrap

## Heading Sizes

Heading size options are all tokenized:

`var(--h1)`
`var(--h2)`
`var(--h3)`
`var(--h4)`
`var(--h5)`
`var(--h6)`

Jump sizing also exists with the syntax `var(--{hsize}-to-{hsize})`. For example, var(--h1-to-h4) will scale text from h1 size down to h4 size on mobile.

- Important: There's no need to set the font size on headings unless you're changing them from their default. Font size is set on headings globally already.
- Important: Don't randomly use jump sizing. It should be used sparingly only when absolutely necessary.

## Text Sizes

Text size options are all tokenized:

`var(--text-xxl)`
`var(--text-xl)`
`var(--text-l)`
`var(--text-m)`
`var(--text-s)`
`var(--text-xs)`

Jump sizing also exists with the syntax `var(--text-{size}-to-text-{size})`. For example, var(--text-xxl-to-text-m) will scale text from XXL size down to M size on mobile.

- Important: There's no need to set the font size on paragraph text unless you're changing it from its default. Font size is set on paragraph text globally already.
- Important: Don't randomly use jump sizing for text sizes. It should be used sparingly only when absolutely necessary.

## Custom Typography

If you need to style custom typography, but retain connection to certain global styles, you should know that all text and heading styles are tokenized with the syntax `heading-{style}` and `text-{style}`. For example, `var(--heading-font-weight)` and `var(--text-line-height)`. This is only needed in a limited range of scenarios.

## Breakpoints

Headings and text never need to be adjusted at breakpoints as they're automatically responsive.
