# Shared Etch helpers

`shared-helpers/` holds the project-agnostic toolkit for driving Etch over the connector. Use it for every bridge script instead of writing builders, upserts or audits again.

```text
shared-helpers/
├── run.mjs          runner: joins kit + project prelude + task, checks syntax, runs eval, decodes output
└── etch/
    ├── blocks.js    block and prop builders
    ├── upsert.js    create-or-update helpers, task() wrapper
    └── audit.js     read-only audits with compact output
```

## Running scripts

Run from the workspace root:

```bash
node shared-helpers/run.mjs <project> <task.js> [more.js …]
node shared-helpers/run.mjs <project> -e "return task(siteAudit)"
```

- `<project>` is a folder name under `projects/` (or any path). Task files are looked up in the project's `etch/` folder first, then relative to the current directory.
- The script sent to Etch is, in order: the three kit files, the project prelude, then the task files and any `-e` snippets. Everything shares one scope, so later files can use anything defined earlier.
- The project prelude defaults to `etch/helpers.js` if it exists.
- The result is decoded and printed as plain JSON or text, without the connector's escaped string wrapper. The banner line is dropped.
- Options:
  - `-t "<tab>"` overrides the tab name.
  - `--timeout <ms>` defaults to 120000.
  - `--kit` / `--no-kit` force the kit on or off. By default it loads only when the project has an `etch.json`.
  - `--check` only runs the local syntax check; it catches duplicate declarations and typos without a round trip to Etch.

Per-project settings live in `projects/<project>/etch/etch.json`:

```json
{
  "tab": "My Site",
  "kit": true,
  "prelude": ["helpers.js"]
}
```

Only `tab` is required; `kit` defaults to `true` once the file exists. Projects without an `etch.json` haven't been migrated: the runner skips the kit, uses their own `helpers.js`, and needs `-t "<tab>"`.

## Project helpers

A project's `helpers.js` holds only what is specific to that site: fonts, icon sets, data expressions, design-specific builders. It must not redeclare any kit name (`el`, `section`, `upsertStyle`, …); a duplicate `const` fails the syntax check.

To migrate an older project, delete the generic definitions from its `helpers.js`, add `etch.json`, and run `--check` on each script. The kit's `instance(name, componentId, attributes, children)` takes the block name first; older scripts may pass `(componentId, attributes, children)` and need updating.

## Writing task scripts

Wrap the work in `task()`, which sets the AI state and restores it afterwards. Return a small summary, never full block trees or raw data.

```javascript
return task(async () => {
  const C = componentIds(['SiteHeader', 'SiteFooter']);
  applyStyles({ '.hero': 'background-color: var(--bg-dark);' });
  const id = await buildPage('Home', [section('hero', 'Hero', [container('hero__inner', 'Inner', [el('h1', 'Title', 'Hello', { class: 'hero__title' })])])]);
  return { id, tree: treeSummary(etch.blocks.getTree(), 2) };
});
```

## Kit reference

### `blocks.js`

| Helper | Builds |
| --- | --- |
| `txt(text)` | Text node |
| `el(tag, name, children, attributes)` | Element; `children` may be a string |
| `dyn(name, tag, children, attributes)` | `<etch:element tag>`, e.g. tag `'{props.tag}'` |
| `cond(name, conditionString, children)` | Condition block |
| `loop(target, itemId, children, name)` | Loop block, e.g. `loop("data('posts')", 'post', […])` |
| `instance(name, componentId, attributes, children)` | Component instance |
| `slot(slotName, children)` | Slot content inside an instance |
| `render(target)` | `etch/render`, default `this.content` |
| `image(mediaId, alt, attrs)` | `<etch:img>` from the media library |
| `img(name, src, attrs)` | Plain `<img>` for external URLs |
| `svg(name, viewBox, shapes, attrs)` | Inline SVG, `shapes` as `[[tag, attrs], …]` |
| `section(cls, name, children, extra)` | `<section data-etch-element="section">` |
| `container(cls, name, children, extra)` | `<div data-etch-element="container">` |
| `prop.text / url / image / select / object / repeater` | Component prop definitions |
| `tagProp(options)`, `headingProp(options)` | Standard `tag` and `headingLevel` select props |

### `upsert.js`

| Helper | Does |
| --- | --- |
| `task(fn)` | Runs `fn` with the AI working state; returns its result |
| `upsertStyle(selector, css)`, `applyStyles({ selector: css })` | Create or update selectors (call `etch.saveAsync()` unless a build helper below saves) |
| `deleteStyles([selectors])` | Remove selectors; returns the ones deleted |
| `addKeyframes(name, body)` | Append to the global **Animations** stylesheet, creating it if needed; skips existing names |
| `upsertComponent(definition)` | Create or update by `key` or `name`; returns the id |
| `componentId(key)`, `componentIds([keys])` | Look up component ids |
| `upsertDataSource(key, def)` with `apiSource(name, url)` / `jsSource(name, code)` | Create or update a data source |
| `deleteDataSources([keys])` | Remove data sources; returns the ones deleted |
| `ensurePage(title, postType)`, `ensureTemplate(title)` | Find or create |
| `replaceTree(blocks)` | Replace the open document's top-level blocks and save |
| `buildPage(title, blocks)`, `buildTemplate(title, blocks)` | Find or create, open, replace, save; return the id |
| `buildIndexTemplate(headerKey, footerKey)` | The `index` template (header, `<main>` around `this.content`, footer), assigned to the root route |
| `rootRoute()` | The root route |
| `upsertRoute(parentId, match, segment, def)` | Find by segment (or a predicate), create if missing, then update; returns the id |
| `dataSourceRoute(keys, templateId, extra)` | Route definition that publishes one page per array element |
| `ensureCollection(name)` | Find or create an asset collection; returns the id |

### `audit.js`

All audits are read-only. `collectDocuments()` opens every page and template in turn, then returns the editor to where it was.

| Helper | Returns |
| --- | --- |
| `treeSummary(blocks, depth)` | One line per block: `tag.classes "Name"` |
| `auditDataSources()` | Where each data source is used: pages, templates, components, JS sources, routes |
| `auditComponents()` | Where each component is placed |
| `auditSelectors()` | Selectors no block uses, and block classes with no selector |
| `auditAssets()` | Counts per collection and any uncollected assets |
| `auditRoutes()` | Routes, path count by status, unpublished paths |
| `siteAudit()` | All of the above, with one pass over the documents |

Pass the result of `collectDocuments()` into several audits to avoid opening every document more than once.

## Adding to the kit

Add a helper only when it is useful across projects and has been run against a live site. Keep each helper idempotent, keep its output compact, and add a row to the reference above.
