# etch-css-reset

The project ships a CSS reset that agents MUST be aware of before writing styles.
It is shipped by Etch and wrapped in a cascade layer named `etch-reset`.

## Cascade layer — read this first

The entire reset lives inside `@layer etch-reset { ... }`.

- **Unlayered CSS always beats layered CSS**, regardless of specificity. Normal
  project styles will override the reset automatically.
- **Do NOT use `!important` to "beat" the reset.** Just write a normal rule.
- Only styles placed in an *earlier-declared* layer would lose to it, so in
  practice your authored CSS wins.

## What the reset already handles — do not re-declare these

Box model & spacing
- `box-sizing: border-box` on all elements and pseudo-elements.
- `margin: 0` on everything. **All default margins are gone — add spacing
  intentionally.**

Document / html
- Disables iOS/Firefox text-size inflation (`text-size-adjust: none`).
- `scrollbar-gutter: stable` on `html`.

Body layout
- `body` is a flex column with `min-block-size: 100svh`.
- `main` inside body gets `flex-grow: 1` (sticky-footer layout by default).

Lists
- `ul[role='list']` / `ol[role='list']` have `list-style: none`.
- `ul[class]` / `ol[class]` get `padding: 0; list-style: none` — **except**
  `.wp-block-list`, `.list`, `[class*='marker']`, and the builder-only
  `[data-etch-has-custom-classes='false']`.
- To keep markers/indentation on a classed list, use `.list` (or `.wp-block-list`).

Media & links (important gotcha)
- `img, picture, video, canvas, svg` and standalone `a` (not nested in text
  elements like `p`, `span`, headings, `li`, etc.) are set to:
  `max-inline-size: 100%; height: auto; display: block`.
- **Images and unclassed standalone links are `display: block` by default.** If
  you need inline behavior, override it intentionally.
- `figure > img { inline-size: 100% }`, `img { block-size: auto }`.

Forms & buttons
- `input, button, textarea, select` inherit font + font-size.
- `button`: `cursor: pointer`, transparent background, no border,
  `color: currentColor`.
- `textarea:not([rows])` has `min-height: 10em`.

Typography
- `p, h1–h6` use `overflow-wrap: break-word`.

Restored WordPress/Gutenberg helpers (already present — reuse, don't redefine)
- `.has-text-align-left|center|right`, `.has-fit-text` (nowrap).
- `.aligncenter` (`clear: both`).
- `.items-justified-left|center|right|space-between`.
- `.screen-reader-text` (+ `:focus`) accessibility utility.
- `#end-resizable-editor-section { display: none }`.

## Rules for agents

- Don't re-declare any reset behavior listed above.
- Don't use `!important` to override the reset — normal unlayered rules win.
- Remember margins are zeroed and media is `display: block`; add what you need.
- Build component and utility styles ON TOP of the reset, not against it.
- Use the documented exception classes (`.list`, `.wp-block-list`) instead of
  re-adding list styling manually.

## Reference: full reset source

```css
@layer etch-reset {
	/* Box sizing rules */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	/* Remove default margins */
	* {
		margin: 0;
	}

	/* Prevent font size inflation */
	html {
		-moz-text-size-adjust: none;
		-webkit-text-size-adjust: none;
		text-size-adjust: none;
		scrollbar-gutter: stable;
	}

	/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
	ul[role='list'],
	ol[role='list'] {
		list-style: none;
	}

	ul[class]:not(
			[data-etch-has-custom-classes='false'], /* data-etch-has-custom-classes is builder only (not output on frontend) */
			.wp-block-list,
			.list,
			[class*='marker']
		),
	ol[class]:not(
			[data-etch-has-custom-classes='false'], /* data-etch-has-custom-classes is builder only (not output on frontend) */
			.wp-block-list,
			.list,
			[class*='marker']
		) {
		padding: 0;
		list-style: none;
	}

	/* Set body min height */
	body {
		min-block-size: 100svh;
		display: flex;
		flex-direction: column;

		main {
			flex-grow: 1;
		}
	}

	/* A elements that don't have a class get default styles */
	a:not([class]) {
		text-decoration-skip-ink: auto;
	}

	/* Make media easier to work with */
	img,
	picture,
	video,
	canvas,
	svg:not(.block-editor-list-view-tree svg),
	a:not(
		p > a,
		span > a,
		h1 > a,
		h2 > a,
		h3 > a,
		h4 > a,
		h5 > a,
		h6 > a,
		li > a,
		em > a,
		q > a,
		label > a,
		strong > a,
		figcaption > a,
		.editor-styles-wrapper a
	) {
		max-inline-size: 100%;
		height: auto;
		display: block;
	}

	/* Inherit fonts for inputs and buttons */
	input,
	button,
	textarea,
	select {
		font: inherit;
		font-size: inherit;
	}

	button {
		cursor: pointer;
		background-color: transparent;
		border: none;
		color: currentColor;
	}

	/* Make sure textareas without a rows attribute are not tiny */
	textarea:not([rows]) {
		min-height: 10em;
	}

	/* Avoid text overflows */
	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		overflow-wrap: break-word;
	}

	figure > img {
		inline-size: 100%;
	}

	img {
		block-size: auto;
	}

	/* Add back select GB styles that are removed by global settings toggle */
	.has-text-align-center {
		text-align: center;
	}

	.has-text-align-left {
		text-align: left;
	}

	.has-text-align-right {
		text-align: right;
	}

	.has-fit-text {
		white-space: nowrap !important;
	}

	#end-resizable-editor-section {
		display: none;
	}

	.aligncenter {
		clear: both;
	}

	.items-justified-left {
		justify-content: flex-start;
	}

	.items-justified-center {
		justify-content: center;
	}

	.items-justified-right {
		justify-content: flex-end;
	}

	.screen-reader-text {
		border: 0;
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
		word-wrap: normal !important;
	}

	.screen-reader-text:focus {
		background-color: #ddd;
		clip-path: none;
		color: #444;
		display: block;
		font-size: 1em;
		height: auto;
		left: 5px;
		line-height: normal;
		padding: 15px 23px 14px;
		text-decoration: none;
		top: 5px;
		width: auto;
		z-index: 100000;
	}
}
```
