# Colors

ACSS has a wide range of color options including brand palette colors (e.g. `primary`) and shades (e.g. `primary-light`), semantic/status colors (e.g. `success`), and contextualized colors (e.g. `text-light`).

All colors are referenceable via tokens without any prefix or suffix (e.g. `var(--primary)` or `var(--text-light)`).

For backgrounds and foregrounds, it's best to default to contextualized colors when possible and specific palette colors when contextualized colors are impractical or unlikely to create the desired outcome.

## Palette Colors

- Primary: The main action/brand color.
- Secondary: A secondary brand color.
- Tertiary: A third brand color option.
- Accent: A brand color that is used sparingly.
- Base: The brand color most often used for widespread background and foreground scenarios.
- Neutral: Always reserved for blacks, whites, and greys.

# Constant Colors

var(--white) - Use any time you need pure white.
var(--black) - Use any time you need pure black.

If you need shades of grey, use the "Neutral" tokens form Palette colors.

## Palette Shades

Every palette color has the following shade options using the syntax `{color}-{shade}` e.g. `var(--primary-ultra-light)`.

- Ultra Dark
- Dark
- Semi Dark
- Semi Light
- Light
- Ultra Light
- Hover (Reserved for onHover effects)

## Semantic Colors

- Success
- Danger
- Warning
- Info

Semantic colors also have generated shades the same as palette colors.

## Contextual Colors

--body-bg-color = the website background color (rarely needed)
--bg-ultra-light
--bg-light
--bg-ultra-dark
--bg-dark
--text-light
--text-light-muted
--text-dark
--text-dark-muted

These are used whenever possible. The user maps them to the colors that best fit the most common scenarios in the UI design.

Important: If you need white, use var(--white) instead of a contextual color. If you need black use use var(--black) instead of a contextual color.
