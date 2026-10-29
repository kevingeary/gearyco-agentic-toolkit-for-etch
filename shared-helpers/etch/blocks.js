// Block and prop builders. Every builder returns plain block JSON for etch.blocks.create()
// or a component's `blocks`; nothing here touches the canvas.

const txt = (text) => ({ type: 'etch/text', version: 1, context: { name: 'Text' }, children: [], text });

const kids = (children) => (typeof children === 'string' ? [txt(children)] : children);

const el = (tag, name, children = [], attributes = {}) => ({
  type: 'etch/element',
  version: 1,
  context: { name },
  children: kids(children),
  tag,
  attributes,
});

// <etch:element tag={…}>, e.g. dyn('Card', '{props.tag}', [...], { class: 'card' })
const dyn = (name, tag, children = [], attributes = {}) => ({
  type: 'etch/dynamic-element',
  version: 1,
  context: { name },
  children: kids(children),
  attributes: { tag, ...attributes },
});

const cond = (name, conditionString, children) =>
  ({ type: 'etch/condition', version: 1, context: { name }, children: kids(children), conditionString });

const loop = (target, itemId, children, name = 'Loop') =>
  ({ type: 'etch/loop', version: 1, context: { name }, target, itemId, children: kids(children) });

const instance = (name, componentId, attributes = {}, children = []) =>
  ({ type: 'etch/component', version: 1, context: { name }, children, componentId, attributes });

const slot = (slotName, children) =>
  ({ type: 'etch/slot-content', version: 1, context: {}, children: kids(children), slotName });

const render = (target = 'this.content') =>
  ({ type: 'etch/render', version: 1, context: { name: 'Render' }, children: [], target });

// <etch:img mediaId>; prefer this over img() for media-library images.
const image = (mediaId, alt = '', attrs = {}) => ({
  type: 'etch/dynamic-image',
  version: 1,
  context: { name: 'Image' },
  children: [],
  attributes: { mediaId: String(mediaId), alt, useSrcSet: 'true', ...attrs },
});

const img = (name, src, attrs = {}) => el('img', name, [], { src, alt: '', loading: 'lazy', decoding: 'async', ...attrs });

// svg('Arrow', '0 0 20 20', [['path', { d: 'M5 15L15 5' }]], { class: 'x__icon' })
const svg = (name, viewBox, shapes, attrs = {}) =>
  el(
    'svg',
    name,
    shapes.map(([tag, a]) => el(tag, tag === 'path' ? 'Path' : 'Shape', [], a)),
    { viewBox, 'aria-hidden': 'true', focusable: 'false', ...attrs }
  );

const section = (cls, name, children, extra = {}) =>
  el('section', name, children, { class: cls, 'data-etch-element': 'section', ...extra });

const container = (cls, name, children, extra = {}) =>
  el('div', name, children, { class: cls, 'data-etch-element': 'container', ...extra });

const withDefault = (def) => (def === undefined ? {} : { default: def });

const prop = {
  text: (name, key, def) => ({ name, key, type: { primitive: 'string' }, ...withDefault(def) }),
  url: (name, key, def) => ({ name, key, type: { primitive: 'string', specialized: 'url' }, ...withDefault(def) }),
  image: (name, key, def) => ({ name, key, type: { primitive: 'string', specialized: 'image' }, ...withDefault(def) }),
  select: (name, key, options, def) => ({ name, key, type: { primitive: 'string', specialized: 'select' }, selectOptionsString: options.join('\n'), ...withDefault(def) }),
  object: (name, key) => ({ name, key, type: { primitive: 'object' } }),
  repeater: (name, key, properties) => ({ name, key, type: { primitive: 'array', specialized: 'repeater' }, properties }),
};

const tagProp = (options = ['li', 'article', 'div']) => prop.select('Tag', 'tag', options);
const headingProp = (options = ['h3', 'h2', 'h4']) => prop.select('Heading Level', 'headingLevel', options);
