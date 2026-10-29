# Keyframes & the Animations Stylesheet

Apply these rules whenever you add or edit CSS `@keyframes` in Etch.

## Hard rules

1. **`@keyframes` cannot be nested** inside a component class, id, or element rule.
   Do not put them inside BEM selectors even though Etch allows nesting for
   pseudo-classes, pseudo-elements, `@media`, and `@container`.
2. **`@keyframes` belong in a global stylesheet only** — never on block-attached
   class rules via `etch.styles.create()`. That API rejects `@keyframes` selectors.
3. **Component classes only reference animations** with the `animation` property
   (or `animation-*` longhands). The `@keyframes` definition lives elsewhere.
4. **Use the Animations stylesheet.** Before creating keyframes, look for an
   existing global stylesheet named **Animations**. If one does not exist, create it.

## Finding or creating the Animations stylesheet

When driving Etch via the connector:

```javascript
let sheet = etch.stylesheets.list().find((s) => s.name === "Animations");

if (!sheet) {
  const id = await etch.stylesheets.createAsync({
    name: "Animations",
    css: "",
  });
  sheet = etch.stylesheets.get(id);
}
```

When authoring manually in the Etch UI: open **Styles → Stylesheets**, look for
**Animations**, and create a new stylesheet with that exact name if it is missing.

## Adding keyframes

Append `@keyframes` blocks to the Animations stylesheet — one block per animation
name. Stylesheet mutations persist immediately; `etch.saveAsync()` is not required
for stylesheet changes.

```javascript
await etch.stylesheets.appendAsync(
  sheet.id,
  `@keyframes hero-slide {
  to { transform: translateY(-50%); }
}`
);
```

Avoid duplicating an animation name that already exists in the sheet. Read the
sheet first with `etch.stylesheets.get(sheet.id)` and skip or update if the name
is already defined.

## Referencing keyframes on components

Attach the animation to the component class via `etch.styles.create()` /
`etch.styles.update()` or the Etch style editor:

```css
.hero__slider {
	animation: hero-slide var(--slide-speed, 50s) linear infinite;
	will-change: transform;
}
```

## Do / don't

Do
- Put every `@keyframes` block in the **Animations** global stylesheet
- Create the **Animations** stylesheet when the project does not have one
- Keep component rules limited to `animation` / `animation-*` references

Don't
- Nest `@keyframes` inside `.block__element { … }`
- Call `etch.styles.create("@keyframes …", …)` — invalid selector
- Add `@keyframes` to the Main stylesheet or any non-Animations global sheet
