import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer (hydroflask.com replica chrome) - decodes the authored /footer document.
 *
 * Footer document contract (sections, classified by content; empty sections ignored):
 *   - feature   (has images): desktop <img>, optional mobile <img>, logo <img>, <p><a>Shop</a></p>
 *   - columns   (<h2> + <ul> pairs, no paragraphs)
 *   - touch     (<h2> + <p>s): title, intro text, social <ul> (link text = accessible name,
 *               icon chosen by host), newsletter label <p>, consent <p>
 *   - bottom    (no heading): copyright <p>, accessibility link <p>, locale <p>,
 *               trafficking <p>, privacy <p> (two links)
 *
 * Authored nodes are MOVED into the layout (never rebuilt); wrappers carry the classes.
 * The newsletter form is block UI (no backend connected yet - the source posts to its CRM).
 * @ew-exempt none
 */

const ICON_HOSTS = {
  instagram: 'instagram',
  tiktok: 'tiktok3',
  facebook: 'facebook',
  youtube: 'youtube',
  pinterest: 'pinterest',
  levelaccess: 'accessibility_icon',
};

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  });
  e.append(...kids.filter(Boolean));
  return e;
}

function wrap(node, cls, tag = 'div') {
  const w = el(tag, { class: cls });
  if (node) w.append(node);
  return w;
}

function contentOf(section) {
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  return [...wrapper.children];
}

function iconFor(a) {
  let host = '';
  try {
    host = new URL(a.href).hostname;
  } catch (e) {
    return null;
  }
  const key = Object.keys(ICON_HOSTS).find((k) => host.includes(k));
  return key ? ICON_HOSTS[key] : null;
}

const NEW_WINDOW = /\s*\(opens in a new (?:window|tab)\)\s*$/i;

/**
 * An authored trailing "(Opens in a new window)" hint (the source's verbatim screen-reader
 * text) is split off the link's last text node into a visually hidden span; the link then
 * opens in a new window, as the hint says. The authored text node is split, never rebuilt.
 */
function decorateNewWindowLinks(root) {
  root.querySelectorAll('a').forEach((a) => {
    const last = a.lastChild;
    if (!last || last.nodeType !== Node.TEXT_NODE) return;
    const m = NEW_WINDOW.exec(last.textContent);
    if (!m) return;
    const hint = last.splitText(m.index);
    const span = el('span', { class: 'sr-only' });
    hint.replaceWith(span);
    span.append(hint);
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/** strips Experience Workspace instrumentation from a presentational clone (EW4) */
function stripInstrumentation(node) {
  [node, ...node.querySelectorAll('*')].forEach((n) => {
    [...n.attributes]
      .filter((at) => at.name.startsWith('data-prose') || at.name.startsWith('data-image'))
      .forEach((at) => n.removeAttribute(at.name));
  });
  return node;
}

/** store switcher: the flag is the button (opens the header panel); label stays editable */
function buildLocale(label) {
  const flag = el('span', { class: 'locale-image' }, el('span', { class: 'locale-flag flag-us', 'aria-hidden': 'true' }));
  const button = el('button', {
    type: 'button', class: 'locale-toggle', 'aria-label': 'Store switcher', 'aria-haspopup': 'dialog',
  }, flag);
  const locale = el('div', { class: 'locale' }, button, wrap(label, 'locale-title'));
  locale.addEventListener('click', () => {
    const toggle = document.querySelector('header .locale-toggle');
    if (toggle) toggle.click();
  });
  return locale;
}

/** icon link: the authored link text stays as the (visually hidden) accessible name */
function decorateIconLink(a) {
  const name = iconFor(a);
  if (!name || a.querySelector('img')) return !!name;
  const label = el('span', { class: 'sr-only' });
  label.append(...a.childNodes);
  const img = el('img', {
    src: `${window.hlx.codeBasePath}/icons/${name}.svg`,
    alt: '',
    'aria-hidden': 'true',
    width: name === 'accessibility_icon' ? 64 : 24,
    height: 24,
    loading: 'lazy',
  });
  a.append(img, label);
  return true;
}

function buildFeature(nodes) {
  const feature = el('div', { class: 'footer-feature' });
  const pics = nodes.filter((n) => n.querySelector('picture, img') || n.matches('picture, img'));
  const links = nodes.filter((n) => !pics.includes(n) && n.querySelector('a'));
  const logo = pics.length > 1 ? pics.pop() : null;
  const [desktop, mobile] = pics;
  if (desktop) {
    feature.append(wrap(desktop, mobile
      ? 'footer-feature-image footer-feature-desktop' : 'footer-feature-image'));
  }
  if (mobile) feature.append(wrap(mobile, 'footer-feature-image footer-feature-mobile'));
  if (logo) feature.append(wrap(logo, 'footer-logo'));
  links.forEach((p) => feature.append(wrap(p, 'footer-shop')));
  return feature;
}

function buildColumns(nodes) {
  const cols = el('div', { class: 'footer-cols' });
  let col = null;
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName) || !col) {
      col = el('div', { class: 'footer-col' });
      cols.append(col);
    }
    if (/^H[1-6]$/.test(n.tagName)) col.append(wrap(n, 'footer-title'));
    else col.append(wrap(n, 'footer-links'));
  });
  return cols;
}

function buildTouch(nodes) {
  const touch = el('div', { class: 'footer-touch' });
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const list = nodes.find((n) => n.tagName === 'UL');
  const paras = nodes.filter((n) => n.tagName === 'P');
  const [text, label, ...rest] = paras;
  if (heading) touch.append(wrap(heading, 'footer-title footer-touch-title'));
  if (text) touch.append(wrap(text, 'footer-touch-text'));

  const input = el('input', {
    id: 'footer-newsletter-email',
    type: 'email',
    name: 'email',
    placeholder: 'ie. youremail@email.com',
    autocomplete: 'email',
    required: '',
  });
  const submit = el('button', { type: 'submit' }, 'Submit');
  const status = el('p', { class: 'footer-form-status', 'aria-live': 'polite' });
  const form = el(
    'form',
    { class: 'footer-form', action: '#', novalidate: '' },
    wrap(label, 'footer-form-label', 'label'),
    el('div', { class: 'footer-form-row' }, input, submit),
    status,
  );
  form.querySelector('label').setAttribute('for', input.id);
  form.addEventListener('submit', (e) => {
    // newsletter: no backend connected yet (owner decision D4) - nothing is sent
    e.preventDefault();
    status.textContent = input.checkValidity()
      ? 'Newsletter sign-up is not connected yet: no data was sent.'
      : 'Please enter a valid email address.';
  });
  const signup = el('div', { class: 'footer-signup' }, form);
  rest.forEach((p) => signup.append(wrap(p, 'footer-consent')));
  touch.append(signup);

  if (list) {
    list.querySelectorAll('a').forEach((a) => decorateIconLink(a));
    touch.append(wrap(list, 'footer-social'));
    // the source renders the icon row twice (wide + narrow layouts); the copy stays hidden here
    const copy = stripInstrumentation(list.cloneNode(true));
    touch.append(el('div', { class: 'footer-social footer-social-copy', 'aria-hidden': 'true' }, copy));
  }
  return touch;
}

function buildBottom(nodes) {
  const frag = [];
  const bottom = el('div', { class: 'footer-bottom' });
  const meta = el('div', { class: 'footer-meta' });
  const tail = [];
  nodes.forEach((n, i) => {
    const a = n.querySelector('a');
    if (i === 0) {
      bottom.append(wrap(n, 'footer-copy'));
    } else if (!a) {
      meta.append(buildLocale(n));
    } else if (n.querySelectorAll('a').length === 1 && iconFor(a)) {
      decorateIconLink(a);
      meta.prepend(wrap(n, 'footer-a11y'));
    } else {
      tail.push(n);
    }
  });
  bottom.append(meta);
  frag.push(bottom);
  const [trafficking, ...more] = tail;
  if (trafficking) frag.push(wrap(trafficking, 'footer-trafficking'));
  more.forEach((p) => frag.push(wrap(p, 'footer-privacy')));
  return frag;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('picture, img'));

  decorateNewWindowLinks(fragment);
  const inner = el('div', { class: 'footer-inner' });
  const menu = el('div', { class: 'footer-menu' });
  let feature = null;
  sections.forEach((s) => {
    const nodes = contentOf(s);
    const hasHeading = nodes.some((n) => /^H[1-6]$/.test(n.tagName));
    if (s.querySelector('picture, img') && !feature) {
      feature = buildFeature(nodes);
    } else if (hasHeading && nodes.some((n) => n.tagName === 'P')) {
      menu.append(buildTouch(nodes));
    } else if (hasHeading) {
      menu.append(buildColumns(nodes));
    } else {
      menu.append(...buildBottom(nodes));
    }
  });
  if (feature) inner.append(feature);
  inner.append(menu);
  block.replaceChildren(inner);
}
