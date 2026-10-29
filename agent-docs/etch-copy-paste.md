# Cross-Site Copy & Paste

Apply these rules whenever you copy blocks, sections, or components from one Etch
tab/site to another (including via etch-connector).

## Hard rules

1. **Use the blocks copy/paste API** for cross-site content migration — the
   programmatic equivalent of Cmd-C / Cmd-V. Do not invent an alternative path.
2. **Do not write custom export/import scripts** — no hand-rolled
   `getJson` + recursive `create`/`addClass`, no repo-local migration scripts for
   standard copy tasks.
3. **Do not treat legacy migration scripts in the repo as the canonical pattern**
   unless AGENTS.md explicitly points to them.
4. **Do not manually migrate dependencies** (styles, components, loops) in parallel
   with a copy operation unless paste fails and the user asks for a fallback.

## Before scripting — verify the live API

Do not rely on method names, signatures, or behavior copied from this file or from
memory. The public API changes; training data and stale docs are unreliable.

**Look up the current copy/paste API first**, in this order:

1. Injected Etch documentation chunks (if available in context).
2. Context7 — query for the blocks copy/paste API for Etch.
3. A connected tab — probe what exists on `etch.blocks` before writing a script:

```bash
npx @digital-gravy/etch-connector eval -t TAB \
  "return Object.keys(etch.blocks).filter(k => /copy|paste/i.test(k)).sort();"
```

If you cannot confirm the API, say so — do not fall back to a custom migration
script.

## Cross-tab workflow (etch-connector)

When source and destination are different connected tabs:

1. **Verify** copy/paste methods on a connected tab (see above).
2. **List tabs** — `npx @digital-gravy/etch-connector tabs`.
3. **Find the block** on the source tab (`getTree()`, `find()`, or structure name).
4. **Copy** on the source tab — call the documented copy method; capture the
   returned payload (stdout or temp file).
5. **Paste** on the destination tab — pass that payload to the documented paste
   method.
6. **Select** the new block if appropriate.
7. Do not call `etch.saveAsync()` unless the user explicitly asks to save.

Payload handoff between tabs: the copy output is plain JSON. Write it to a temp
file or pipe it through a small host-side script, then embed it in a destination
`-f` eval script. Exact shell mechanics are up to you — keep them minimal.

## When copy/paste is not enough

Only escalate manually if paste fails or the user asks:

- **Loops** — check Loop Manager if loops break at runtime after a successful paste.
- **Components** — manual component work is for editing a component in isolation,
  not for standard section migration between sites.
- **Media** — re-bind media on the destination site if attachment IDs differ and
  images break after paste.

## Do not

- Write one-off migration scripts in the repo for standard copy tasks.
- Use `getJson()` + `create()` + manual `addClass()` loops for cross-site section
  migration.
- Duplicate API signatures or behavioral claims from external docs into this file.
- Call `etch.saveAsync()` unless the user explicitly asks to save.
