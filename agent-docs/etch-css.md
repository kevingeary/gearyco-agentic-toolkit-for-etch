# Etch CSS reference

Examples for the CSS rules in `AGENTS.md`. Read alongside `etch-css-reset.md` and, when ACSS is in use, `automatic-css.md`.

## Flat BEM, nested states and queries

Every BEM class gets its own top-level rule. Pseudo-classes, pseudo-elements, `@media` and `@container` rules nest inside the selector they change. Media queries are never placed at the root level.

Wrong:

```css
.hero__button {
	&--primary {
		background: red;
	}
}
@media (max-width: 48rem) {
	.hero__title {
		font-size: 2rem;
	}
}
```

Right:

```css
.hero__button--primary {
	background: red;
}
.hero__title {
	font-size: to-rem(48px);
	@media (max-width: to-rem(768px)) {
		font-size: to-rem(32px);
	}
}
```

## Rem values

Avoid raw rem values. Use `to-rem()` instead, converting with 1rem = 16px.

Bad example: `max-inline-size: 48rem;`
Good example: `max-inline-size: to-rem(768px);`

`to-rem()` does not support negative values. For a negative value, multiply by -1 in a `calc()`.

Bad example: `max-inline-size: to-rem(-48px);`
Good example: `max-inline-size: calc(to-rem(48px) * -1);`

## Keyframes

`@keyframes` go in the global **Animations** stylesheet only; component classes only reference the animation. Workflow: `etch-keyframes.md` (or the kit's `addKeyframes()`).

Wrong:

```css
.hero__slider {
	animation: hero-slide 50s linear infinite;

	@keyframes hero-slide {
		to { transform: translateY(-50%); }
	}
}
```

Right — keyframes in the **Animations** stylesheet:

```css
@keyframes hero-slide {
	to { transform: translateY(-50%); }
}
```

Right — animation reference on the component class:

```css
.hero__slider {
	animation: hero-slide 50s linear infinite;
}
```

## Minimum element sizes

Etch sets a minimum element size on canvas elements so they stay clickable. This can break layouts where an element needs to be smaller. If an element gets a width or max-width under 20px, set `--empty-element-size: 0` on it.

Bad example:

```css
.some-element {
	max-inline-size: 16px;
}
```

Good example:

```css
.some-element {
	--empty-element-size: 0;
	max-inline-size: to-rem(16px);
}
```
