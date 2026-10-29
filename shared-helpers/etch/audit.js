// Read-only audits that return compact summaries instead of full block trees.

// ['section.orbit-hero "Orbit Hero"', '  div.orbit-hero__glow "Glow"', …]
const treeSummary = (blocks = etch.blocks.getTree(), depth = 3, indent = '') =>
  blocks.flatMap((b) => {
    const tag = b.tag ?? b.attributes?.tag ?? b.type.replace('etch/', '');
    const cls = b.attributes?.class ? '.' + b.attributes.class.trim().split(/\s+/).join('.') : '';
    const line = `${indent}${tag}${cls} "${b.context?.name ?? ''}"`;
    return depth > 1 && b.children?.length ? [line, ...treeSummary(b.children, depth - 1, indent + '  ')] : [line];
  });

// { 'page:Home': blocks, 'template:index': blocks, 'component:Site Header': json } — opens each
// document in turn, then returns the editor to where it was.
const collectDocuments = async () => {
  const docs = {};
  for (const c of etch.components.list()) docs[`component:${c.name}`] = etch.components.getJson(c.id);
  const place = etch.navigation.getCurrentPlace();
  try {
    for (const type of await etch.content.listTypesAsync()) {
      if (type.isTemplate) continue;
      for (const item of await etch.content.listItemsAsync(type.key)) {
        await etch.navigation.openPostAsync(item.id);
        docs[`${type.key}:${item.title}`] = etch.blocks.getTree();
      }
    }
    for (const t of await etch.navigation.listTemplatesAsync()) {
      await etch.navigation.openTemplateAsync(t.id);
      docs[`template:${t.title}`] = etch.blocks.getTree();
    }
  } finally {
    if (place) await etch.navigation.goTo(place);
  }
  return docs;
};

const walkJson = (value, visit) => {
  if (Array.isArray(value)) value.forEach((v) => walkJson(v, visit));
  else if (value && typeof value === 'object') {
    visit(value);
    Object.values(value).forEach((v) => walkJson(v, visit));
  }
};

const whereMatches = (docs, test) =>
  Object.entries(docs).filter(([, json]) => test(JSON.stringify(json))).map(([where]) => where);

// { key: [where it's used] } — includes JS sources and routes that consume another source.
const auditDataSources = async (docs) => {
  docs ??= await collectDocuments();
  const sources = etch.dataSources.list();
  const routes = await etch.routes.listAsync();
  return Object.fromEntries(sources.map(({ key }) => {
    const used = new RegExp(`data\\(\\s*\\\\?['"]${key}\\\\?['"]`);
    return [key, [
      ...whereMatches(docs, (s) => used.test(s)),
      ...sources.filter((s) => s.key !== key && s.type === 'js' && used.test(s.metadata?.code ?? '')).map((s) => `source:${s.key}`),
      ...routes.filter((r) => r.source?.dataSources?.includes(key)).map((r) => `route:${r.segment}`),
    ]];
  }));
};

// { 'Component Name': [where an instance is placed] }
const auditComponents = async (docs) => {
  docs ??= await collectDocuments();
  return Object.fromEntries(etch.components.list().map((c) => [c.name, Object.entries(docs).filter(([where, json]) => {
    if (where === `component:${c.name}`) return false;
    let hit = false;
    walkJson(json, (o) => { if (o.type === 'etch/component' && String(o.componentId) === String(c.id)) hit = true; });
    return hit;
  }).map(([where]) => where)]));
};

// Class selectors no block uses, and classes on blocks with no Etch selector (usually ACSS utilities).
const auditSelectors = async (docs) => {
  docs ??= await collectDocuments();
  const used = new Set();
  walkJson(docs, (o) => {
    if (typeof o.attributes?.class === 'string') o.attributes.class.split(/\s+/).filter((c) => c && !c.includes('{')).forEach((c) => used.add(c));
  });
  const selectors = etch.styles.list().map((s) => s.selector).filter((s) => /^\.[\w-]+$/.test(s));
  const defined = new Set(selectors.map((s) => s.slice(1)));
  return {
    unusedSelectors: selectors.filter((s) => !used.has(s.slice(1))),
    classesWithoutSelector: [...used].filter((c) => !defined.has(c)).sort(),
  };
};

const auditAssets = async () => {
  const assets = await etch.assets.listAsync();
  const collections = await etch.assets.listCollectionsAsync();
  return {
    total: assets.length,
    byCollection: Object.fromEntries(collections.map((c) => [c.name, assets.filter((a) => a.collectionIds?.includes(c.id)).length])),
    uncollected: assets.filter((a) => !a.collectionIds?.length).map((a) => `${a.id} ${a.fileName}`),
  };
};

const auditRoutes = async () => {
  const routes = await etch.routes.listAsync();
  const paths = await etch.routes.getPathsAsync();
  const byStatus = {};
  for (const p of paths) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
  return {
    routes: routes.map((r) => `${r.segment || '/'} [${r.kind}] template ${r.templateId ?? 'inherit'}${r.source?.dataSources?.length ? ' · sources ' + r.source.dataSources.join(', ') : ''}`),
    paths: paths.length,
    byStatus,
    notPublished: paths.filter((p) => p.status !== 'published').slice(0, 20).map((p) => `${p.path} (${p.status})`),
  };
};

const siteAudit = async () => {
  const docs = await collectDocuments();
  return {
    dataSources: await auditDataSources(docs),
    components: await auditComponents(docs),
    selectors: await auditSelectors(docs),
    assets: await auditAssets(),
    routes: await auditRoutes(),
  };
};
