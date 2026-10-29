# Etch Studio conventions

Project conventions for content types, templates and assets on Etch Studio sites.

## URL slugs

- Name any custom field that stores a URL path segment **Slug**.
- Use the field key `slug`.
- Reference it in dynamic routes as `{this.fields.slug}`.
- Do not use alternatives such as `url_segment`, `url`, or `permalink` for this purpose.
- Before creating the field, inspect the content type and reuse or rename an equivalent field instead of adding a duplicate.

Example:

```text
Field name: Slug
Field key: slug
Route segment: {this.fields.slug}
```

## Main template

- Name the primary site template `index`.
- The `index` template contains the shared header and footer and renders the current record’s content.
- Wrap the `@render` block in a `<main>` element, placed between the header and footer. Do not leave `@render` as a direct sibling of the header and footer.
- Reuse `index` for standard routes instead of creating equivalent templates with names such as `Default Page` or `Main`.

## Asset collections

- Every uploaded asset must belong to a collection. Never leave an asset uncollected.
- Before uploading, list the existing collections with `etch.assets.listCollectionsAsync()` and reuse a matching one. Only create a collection when none fits.
- Group by what the asset is, using plural names: `Fonts`, `Graphics` (decorative SVGs, patterns, textures), `Icons`, `Logos`, `Photos`, `Documents`.
- Assign the collection in the same step as the upload: pass `--collection <id>` to `etch-connector upload`, or call `etch.assets.updateAsync(id, { collectionIds: [collectionId] })` straight after `uploadAsync`.
- `etch.assets.createCollectionAsync(name)` takes the name as a plain string.
- After uploading, confirm with `etch.assets.listAsync()` that no asset has an empty `collectionIds`.
