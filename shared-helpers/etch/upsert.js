// Create-or-update helpers. Each one finds the existing record by a stable key or name and
// updates it, so any task script can be re-run safely.

// return task(async () => { …; return summary; })
const task = async (fn) => {
  etch.ai.setState('working');
  try {
    return await fn();
  } finally {
    etch.ai.setState('thinking');
  }
};

// Styles (etch.styles.* needs etch.saveAsync(); replaceTree/buildPage/buildTemplate save for you)

const upsertStyle = (selector, css) => {
  const existing = etch.styles.list().find((s) => s.selector === selector);
  if (existing) etch.styles.update(existing.id, { css });
  else etch.styles.create(selector, css);
};

const applyStyles = (defs) => {
  for (const [selector, css] of Object.entries(defs)) upsertStyle(selector, css);
  return Object.keys(defs).length;
};

const deleteStyles = (selectors) => {
  const doomed = etch.styles.list().filter((s) => selectors.includes(s.selector));
  for (const s of doomed) etch.styles.delete(s.id);
  return doomed.map((s) => s.selector);
};

// Appends to the global Animations stylesheet; skips names that already exist.
const addKeyframes = async (name, body) => {
  let sheet = etch.stylesheets.list().find((s) => s.name === 'Animations');
  if (!sheet) sheet = etch.stylesheets.get(await etch.stylesheets.createAsync({ name: 'Animations', css: '' }));
  const css = etch.stylesheets.get(sheet.id).css ?? '';
  if (new RegExp(`@keyframes\\s+${name}\\b`).test(css)) return 'exists';
  await etch.stylesheets.appendAsync(sheet.id, `@keyframes ${name} {\n${body}\n}`);
  return 'added';
};

// Components (persist immediately)

const upsertComponent = async (definition) => {
  const existing = etch.components.list().find((c) => c.key === definition.key || c.name === definition.name);
  const id = existing ? existing.id : await etch.components.createAsync(definition.name);
  await etch.components.updateAsync(id, definition);
  return id;
};

const componentId = (key) => {
  const found = etch.components.list().find((c) => c.key === key);
  if (!found) throw new Error(`Component ${key} not found`);
  return found.id;
};

// const C = componentIds(['SiteHeader', 'SiteFooter']); instance('Header', C.SiteHeader)
const componentIds = (keys) => Object.fromEntries(keys.map((k) => [k, componentId(k)]));

// Data sources (persist immediately)

const upsertDataSource = async (key, { name, type, metadata }) => {
  const existing = etch.dataSources.list().find((d) => d.key === key);
  if (existing) await etch.dataSources.updateAsync(key, { name, type, metadata });
  else await etch.dataSources.createAsync({ key, name, type, metadata });
  return key;
};

const apiSource = (name, url, headers = [['Accept', 'application/json']]) =>
  ({ name, type: 'api', metadata: { url, method: 'GET', headers } });

const jsSource = (name, code) => ({ name, type: 'js', metadata: { code } });

const deleteDataSources = async (keys) => {
  const present = etch.dataSources.list().filter((d) => keys.includes(d.key)).map((d) => d.key);
  for (const key of present) await etch.dataSources.deleteAsync(key);
  return present;
};

// Pages and templates

const ensurePage = async (title, postType = 'page') => {
  const items = await etch.content.listItemsAsync(postType);
  return items.find((p) => p.title === title) ?? (await etch.content.createItemAsync({ postType, title }));
};

const ensureTemplate = async (title) => {
  const existing = (await etch.navigation.listTemplatesAsync()).find((t) => t.title === title);
  if (existing) return existing;
  let type = (await etch.content.listTypesAsync()).find((t) => t.isTemplate);
  if (!type) type = await etch.content.createTypeAsync({ name: 'Templates', isTemplate: true });
  return etch.content.createItemAsync({ postType: type.key, title });
};

// Replaces every top-level block in the open document, then saves.
const replaceTree = async (blocks) => {
  for (const block of etch.blocks.getTree()) etch.blocks.delete(block.id);
  const ids = blocks.map((b) => etch.blocks.create(b, null));
  await etch.saveAsync();
  return ids;
};

const buildPage = async (title, blocks, postType = 'page') => {
  const page = await ensurePage(title, postType);
  await etch.navigation.openPostAsync(page.id);
  await replaceTree(blocks);
  return page.id;
};

const buildTemplate = async (title, blocks) => {
  const template = await ensureTemplate(title);
  await etch.navigation.openTemplateAsync(template.id);
  await replaceTree(blocks);
  return template.id;
};

// The shared `index` template: header, <main> around the current record, footer.
const buildIndexTemplate = async (headerKey, footerKey, title = 'index') => {
  const id = await buildTemplate(title, [
    instance('Site Header', componentId(headerKey)),
    el('main', 'Main', [render('this.content')]),
    instance('Site Footer', componentId(footerKey)),
  ]);
  await etch.routes.updateAsync((await rootRoute()).id, { templateId: id });
  return id;
};

// Routes (persist immediately). createAsync ignores most fields, so always follow with updateAsync.

const rootRoute = async () => (await etch.routes.listAsync()).find((r) => r.kind === 'root');

// match: a segment string, or a predicate for routes whose segment may change, e.g. (r) => r.kind === 'dynamic'
const upsertRoute = async (parentId, match, segment, def = {}) => {
  const test = typeof match === 'function' ? match : (r) => r.segment === match;
  let route = (await etch.routes.listAsync()).find((r) => r.parentId === parentId && test(r));
  if (!route) route = await etch.routes.createAsync({ parentId, segment });
  await etch.routes.updateAsync(route.id, { segment, ...def });
  return route.id;
};

// def for a route that publishes one page per element of a data source's array
const dataSourceRoute = (keys, templateId, extra = {}) =>
  ({ source: { postIds: [], postTypes: [], dataSources: keys }, templateId, ...extra });

// Asset collections

const ensureCollection = async (name) => {
  const existing = (await etch.assets.listCollectionsAsync()).find((c) => c.name === name);
  if (existing) return existing.id;
  const created = await etch.assets.createCollectionAsync(name);
  return created?.id ?? created;
};
