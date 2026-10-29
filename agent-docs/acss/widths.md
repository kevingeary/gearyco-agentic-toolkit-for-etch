# Widths

## Content / Container Max Width

The content width of a website is defined as the width from the left edge of the content to the right edge of the content on a screen that’s large enough not to compress the content.

Typically, this width is assigned most often to divs that are direct children of a section element. In ACSS and Etch, this is done automatically and does not need to be manually added.

If you ever do need to reference the content width of the website, use `var(--content-width)`.

- IMPORTANT: Do not set random max widths on containers unless they're clearly different from the standard content width of the website. Containers are content width by default and using random values will create inconsistencies.

## Changing Element Width

ACSS offers preset width tokens using the syntax `var(--width-{size})` where {size} is a number from 10 to 90 in increments of 10. For example, `var(--width-60)`. Use these whenever possible, but if you need more granular control you can use a custom width value.

Note: You should almost always use `inline-size: 100%;` and then control the element width using `max-inline-size: {value};`
