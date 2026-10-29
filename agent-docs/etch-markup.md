# Etch markup reference

Detailed rules and examples for sections, containers, cards, lists, components, images and conditions. The short versions of these rules are in `AGENTS.md`.

## Sections (data-etch-element="section")

Section elements have the following CSS by default. Don't duplicate this CSS. Only override it when necessary.

```css
inline-size: 100%;
display: flex;
flex-direction: column;
align-items: center;
```

## Containers (data-etch-element="container")

Grouping content inside a section should be done with a "container" (a div with the attribute data-etch-element="container"). This ensures that the content width of the website stays consistent without having to put a max-width on every individual element.

- Containers have `inline-size: 100%;` and `max-inline-size: var(--content-width);` set on them by default. There's no need to write CSS for this.
- Containers have `margin-inline: auto;` by default. Don't duplicate this CSS.
- Containers have `display: flex;` and `flex-direction: column`; by default. Don't duplicate this CSS.

The standard pattern is section > container > content. There can be multiple sibling containers for multiple content groups.

## Cards

A card is its own BEM **block** — not an element of the parent section. The wrapper class uses a single hyphen: `.section-card`, never `.section__card`. Children inside the card are elements of the card block: `.section-card__title`, `.section-card__text`.

Choose a **semantically accurate HTML tag** for the card wrapper based on context:

- `<article>` for self-contained, independently meaningful content
- `<li>` when the card is a list item inside a `ul` or `ol`
- Other tags when the surrounding structure calls for them

Do not default cards to `<div>`. Do not reference `flex-div` or `data-etch-element="flex-div"` — it is deprecated.

Bad example:

```html
<article class="fx-spotlight__card">
  <h3 class="fx-spotlight__card-title">Title</h3>
</article>
```

Good example — cards in a collection (see Grids and Lists below):

```html
<ul class="posts-list" role="list">
  {#loop posts as post}
  <li class="post-card">
    <article class="post-card__inner">
      <h3 class="post-card__title">{post.title}</h3>
    </article>
  </li>
  {/loop}
</ul>
```

## Grids and Lists

Visually these are often laid out as a grid, but semantically they are usually a **list or collection of items** — not a child element of the parent section. The wrapper is its own BEM **block**: `.section-list`, `.posts-list`, never `.section__grid` or `.section__list`.

Choose a **semantically accurate HTML tag** for the collection wrapper:

- `<ul>` or `<ol>` for a collection of similar items — loop the `<li>`, not the card or item block inside it. When the item is a component, loop the component itself with its `tag` prop set to `li` (see Components)
- `<div>` only when the content is not actually a list (e.g. unrelated panels that merely share a grid layout)

The class name can describe layout (`-grid`) or content (`-list`) — either way it is a block, not a `__` element. CSS Grid handles the visual arrangement; the HTML tag carries the meaning.

Bad example:

```html
<div class="fx-spotlight__grid">
  <article class="fx-spotlight-card">…</article>
</div>
```

Good example — collection of items:

```html
<ul class="fx-spotlight-list" role="list">
  {#loop items as item}
  <li class="fx-spotlight-card">
    <h3 class="fx-spotlight-card__title">{item.title}</h3>
    <p class="fx-spotlight-card__text">{item.text}</p>
  </li>
  {/loop}
</ul>
```

Good example — non-list panels sharing a grid layout:

```html
<div class="fx-spotlight-grid">
  <article class="fx-spotlight-card">…</article>
  <article class="fx-spotlight-card">…</article>
</div>
```

## Components

Anything that would typically be a component **must be built as an Etch component with editable props** — never as hand-built, repeated markup on a page. This includes cards (post, tool, appearance, product, testimonial, social), list rows, section headers/intros, timelines, CTAs, and any block used more than once or likely to be reused.

- Create the component with `etch.components.createAsync(name)`, then define it with `etch.components.updateAsync(id, { name, key, description, properties, blocks })`. Place it with an `etch/component` block (`componentId`, prop values in `attributes`). The shared kit's `upsertComponent()` and `instance()` do both (see `etch-shared-helpers.md`).
- Every piece of content is a prop: text, links (`url`), images (`image`), and variants/modifiers (`select`). Reference them in the component's blocks as `{props.key}`; use `group` props to keep related values together.
- Heading levels inside a component are a `select` prop (e.g. `h2`, `h3`) applied through a dynamic element, not a hardcoded tag.
- Repeated items come from a loop over a data source (or content type) that passes values into the component's props — don't paste instance after instance by hand.
- The component's classes follow BEM and its CSS lives on its own Etch selectors, like any other block.
- Don't build class names from props (`card--{props.variant}`): Etch only creates and links selectors for literal classes, so the modifier's CSS may never be output. Put the variant in a data attribute (`data-variant="{props.variant}"`) and style it nested in the base selector (`&[data-variant="featured"] { … }`), or let the parent set a scoped custom property.

**List items:** if a component is rendered as a list item but could also be used outside a list, its root must be the Etch dynamic element with the tag supplied by a component prop — never a hardcoded `li`. Use a `select` prop (e.g. key `tag`, options `li`, `article`, `div`, default the most common) and set the root to `<etch:element tag={props.tag}>` (block type `etch/dynamic-element`, with the tag in its attributes: `attributes: { tag: '{props.tag}', class: '…' }`). In a list, instances set `tag` to `li` directly inside the `ul`/`ol`; don't wrap the component in an extra `li`.

```javascript
const tagProp = {
  name: "Tag",
  key: "tag",
  type: { primitive: "string", specialized: "select" },
  selectOptionsString: ["li", "article", "div"].join("\n"),
};
```

## Images

When asked for images, favor the `<etch:img />` element instead of using a plain `<img />` element:

Bad example:

```html
<img src="{item.featuredImage}" /> // Don't do this
```

Good example for a static use (e.g. no loop), with the URL — use loop key `.featuredImage`:

```html
<etch:img src="{item.featuredImage}" />
```

Good example for a dynamic use (e.g. inside a loop), with the ID — use loop key `.image.id`:

```html
<etch:img mediaId="{item.image.id}" />
```

Important:

- The key for the URL is loop key `.featuredImage`
- The key for the ID is loop key `.image.id`
- Keys loop key `.featuredImage.id` and loop key `.featuredImage.url` do not exist

## Conditions

Do not use conditions in defensive programming techniques by default. Act from the assumption that content is available.

Only use conditions when the user requests it, or when it really makes sense.

Conditions and dynamic data in Etch do not support inline fallbacks. Consult the Etch docs (`docs.etchbuilder.io`, or the connected tab's guide via `etch.skills.get()`) whenever you need to know how to use conditions or comparisons.

Bad example:

```html
{#if featuredImage }
<!-- content -->
{#else}
<!-- other content -->
{/if}
```

Good example:

```html
{#if featuredImage }
<!-- content -->
{/if} {#if !featuredImage }
<!-- other content -->
{/if}
```

Bad example:

```html
<etch:img src={item.featuredImage ?? "url-to-fallback-image.jpeg"} />
```

Good example:

```html
{#if featuredImage }
<etch:img src="{item.featuredImage}" />
{/if} {#if !featuredImage }
<etch:img src="url-to-fallback-image.jpeg" />
{/if}
```

## Full pages

If you are asked to build a full page, do not wrap sections in a main tag. Just provide the page section by section.

Bad example:

```html
<main>
  <section></section>
  <section></section>
</main>
```

Good example:

```html
<section></section>
<section></section>
```
