import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Doosan Bobcat header — template-slotted from the authored /nav document.
 *
 * /nav sections are classified by content, never by index:
 *   brand     a heading holding the home link (DOOSAN)
 *   menu      the nested list (gnb: depth 1 links, depth 2 lists, depth 3 lists) and its
 *             hidden heading ("menu", the drawer's dim layer)
 *   links     paragraphs of external links (request a quote / dealer / jobs)
 *   language  a flat list of language links
 *   logo      a plain paragraph (Doosan Bobcat), rendered as the chrome h1 painted as the
 *             Bobcat logo (as on the source; the /nav document itself carries no h1)
 * Authored nodes are MOVED into the canon chrome DOM (node-slotting); the block only adds
 * classes and presentational wrappers.
 *
 * @ew-exempt UI strings of controls the block builds (search layer, language and menu
 *   buttons) — button-hosted labels are not authorable (EW7); the search target is the
 *   interim from stardust/dynamic-features.md row 2.
 */

const DESKTOP = window.matchMedia('(min-width: 1470px)');
const SEARCH_ACTION = 'https://www.doosanbobcat.com/en/search/result';
// a language root link, root-relative or absolute (E2 may repoint /kr to the source host)
const LANG_HREF = /^(https?:\/\/[^/]+)?\/(en|kr)\/?$/;
const MEDIA = `${window.hlx.codeBasePath}/blocks/header/media`;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** wrap the text nodes of `host` into a span.hide (moved, never re-typed) */
function hideText(host) {
  const span = el('span', 'hide');
  [...host.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) span.append(n);
  });
  host.append(span);
  return span;
}

/** the delivered pipeline wraps list-item links in <p>: unwrap them */
function unwrapParagraphs(root) {
  root.querySelectorAll('li > p').forEach((p) => {
    p.replaceWith(...p.childNodes);
  });
}

/** source path used for the alternate-language links (metadata source-path wins) */
function sourcePath() {
  const meta = getMetadata('source-path');
  let path = meta || window.location.pathname;
  try {
    if (meta && /^https?:/.test(meta)) path = new URL(meta).pathname;
  } catch { /* keep the raw value */ }
  path = path.replace(/\/index$/, '').replace(/\/$/, '');
  return path.replace(/^\/(en|kr)(?=\/|$)/, '') || '';
}

function decorateMenu(list) {
  unwrapParagraphs(list);
  list.classList.add('gnb');
  [...list.children].forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    sub.classList.add('depth2');
    [...sub.children].forEach((item) => {
      const third = item.querySelector(':scope > ul');
      if (!third) return;
      third.classList.add('depth3');
      // depth-3 group label: the authored text (or link) becomes the toggle's span
      const btn = el('a', 'depth3-btn', { href: '#', role: 'button' });
      const label = el('span');
      [...item.childNodes].forEach((n) => {
        if (n !== third) label.append(n);
      });
      const inner = label.querySelector('a');
      if (inner) inner.replaceWith(...inner.childNodes);
      btn.append(label);
      item.prepend(btn);
    });
  });
}

/** mark the active depth-1 item and depth-2 link from the current path */
function markActive(list) {
  const here = window.location.pathname.replace(/\/$/, '');
  const segs = here.split('/').filter(Boolean);
  if (segs.length < 2) return;
  const dir = `/${segs.slice(0, -1).join('/')}/`;
  let best = null;
  let bestLen = dir.length - 1;
  list.querySelectorAll('.depth2 > li > a[href]').forEach((a) => {
    const href = new URL(a.getAttribute('href'), window.location).pathname;
    let n = 0;
    while (n < href.length && n < here.length && href[n] === here[n]) n += 1;
    if (n > bestLen && href.startsWith(dir)) {
      best = a;
      bestLen = n;
    }
  });
  if (!best) return;
  best.parentElement.classList.add('on');
  best.closest('.gnb > li').classList.add('on', 'open');
}

function buildSearch() {
  const box = el('div', 'hd-search');
  const open = el('button', 'btnset btn-search-open', { type: 'button' });
  open.textContent = 'Open search box';
  const wrap = el('div', 'search-wrap');
  const form = el('form', '', {
    role: 'search', action: SEARCH_ACTION, method: 'post',
  });
  const fieldset = el('fieldset');
  const legend = el('legend');
  legend.textContent = 'Search box';
  const row = el('div', 'search-form');
  const input = el('input', 'search-input', {
    type: 'text',
    name: 'headerKeyword',
    placeholder: 'Please enter the search word.',
    'aria-label': 'Search',
    autocomplete: 'off',
  });
  const submit = el('button', 'btnset btn-search', { type: 'submit' });
  submit.append(el('img', '', { src: `${MEDIA}/ico_search_color.png`, alt: 'Search' }));
  row.append(input, submit);
  fieldset.append(legend, row);
  form.append(fieldset);
  const close = el('button', 'btnset btn-search-close', { type: 'button' });
  close.textContent = 'Close search box';
  wrap.append(form, close);
  box.append(open, wrap);

  open.addEventListener('click', () => {
    wrap.classList.add('on', 'active');
    input.focus();
  });
  close.addEventListener('click', () => {
    wrap.classList.remove('active');
    setTimeout(() => wrap.classList.remove('on'), 300);
  });
  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      input.focus();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && wrap.classList.contains('on')) close.click();
  });
  return box;
}

function buildLanguage(list) {
  const box = el('div', 'hd-language');
  const btn = el('button', 'btnset btn-hd-language', { type: 'button', 'aria-expanded': 'false' });
  const label = el('span', 'hide');
  label.textContent = 'Choose your language';
  btn.append(label);
  box.append(btn);
  if (list) {
    unwrapParagraphs(list);
    const rest = sourcePath();
    list.querySelectorAll('a[href]').forEach((a) => {
      const m = a.getAttribute('href').match(LANG_HREF);
      if (m) a.setAttribute('href', `${m[1] || ''}/${m[2]}${rest}`);
    });
    const first = list.querySelector('li');
    if (first) first.classList.add('on');
    box.append(list);
    list.addEventListener('mouseenter', () => box.classList.add('hov-on'));
    list.addEventListener('mouseleave', () => box.classList.remove('hov-on'));
  }
  btn.addEventListener('click', () => {
    box.classList.toggle('on');
    btn.setAttribute('aria-expanded', box.classList.contains('on'));
  });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target)) {
      box.classList.remove('on');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  return box;
}

function bindMenu(block, list) {
  const items = list ? [...list.children] : [];
  block.addEventListener('mouseenter', () => {
    if (DESKTOP.matches) block.classList.add('is-hover');
  });
  block.addEventListener('mouseleave', () => {
    if (!DESKTOP.matches) return;
    items.forEach((li) => li.classList.remove('on'));
    block.classList.remove('is-hover');
  });
  items.forEach((li) => {
    li.addEventListener('mouseenter', () => {
      if (!DESKTOP.matches) return;
      items.forEach((x) => x.classList.remove('on'));
      li.classList.add('on');
    });
    const link = li.querySelector(':scope > a');
    if (!link || !li.querySelector(':scope > ul')) return;
    link.addEventListener('click', (e) => {
      if (DESKTOP.matches) return;
      e.preventDefault();
      const wasOpen = li.classList.contains('open');
      items.forEach((x) => x.classList.remove('open'));
      if (!wasOpen) li.classList.add('open');
    });
  });
  const toggles = [...block.querySelectorAll('.depth3-btn')];
  toggles.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const wasActive = btn.classList.contains('active');
    toggles.forEach((b) => b.classList.remove('active'));
    if (!wasActive) btn.classList.add('active');
  }));
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const host = block.closest('header');
  if (host && !document.getElementById('header')) host.id = 'header';

  const all = [...fragment.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')];
  const gnb = [...fragment.querySelectorAll('ul')].find((u) => u.querySelector('ul'));
  const menuHeading = gnb && gnb.closest('.section')
    ? gnb.closest('.section').querySelector('h2, h3') : null;
  const brand = all.find((n) => /^H[2-6]$/.test(n.tagName) && n.querySelector('a') && n !== menuHeading);
  // the Bobcat logo: a plain paragraph (no link) outside the lists; /nav carries no <h1>
  const logoText = all.find((n) => n.tagName === 'P' && !n.querySelector('a') && !n.closest('li'));
  const isLangLink = (a) => LANG_HREF.test(a.getAttribute('href'));
  const language = all.find((n) => n.tagName === 'UL' && !(gnb && gnb.contains(n))
    && [...n.querySelectorAll('a')].some(isLangLink));
  const links = all.filter((n) => n.tagName === 'P' && n.querySelector('a[href^="http"]')
    && !n.closest('li'));

  block.textContent = '';

  // brand (DOOSAN): authored heading + link
  if (brand) {
    brand.classList.add('hd-logo');
    const a = brand.querySelector('a');
    a.classList.add('logo-doosan');
    hideText(a);
    block.append(brand);
  }

  // menu
  const nav = el('nav', 'gnb-wrap', { 'aria-label': 'Main menu' });
  if (menuHeading) {
    menuHeading.classList.add('hide');
    nav.append(menuHeading);
  }
  const center = el('div', 'center-box');
  if (gnb) {
    decorateMenu(gnb);
    markActive(gnb);
    center.append(gnb);
  }
  const left = el('div', 'left-link');
  links.forEach((p) => {
    const row = el('div', 'row');
    const a = p.querySelector('a');
    const ico = el('span', 'ico');
    ico.append(el('img', '', { src: `${MEDIA}/ico_link_lightgray.png`, alt: '' }));
    a.append(' ', ico);
    row.append(p);
    left.append(row);
  });
  center.append(left);
  nav.append(center);
  block.append(nav);

  // tools
  const info = el('div', 'hd-info');
  info.append(buildSearch(), buildLanguage(language));
  if (logoText) {
    // the source paints the logo as the page-level h1 of the chrome; its text is MOVED in
    const logo = el('h1', 'logo-bobcat');
    const img = el('span', 'logo-img');
    img.textContent = '\u00a0';
    const label = el('span', 'hide');
    label.append(...logoText.childNodes);
    logo.append(img, label);
    logoText.remove();
    info.append(logo);
  }
  const burgerBox = el('div', 'hd-allmenu-open');
  const burger = el('button', 'btnset btn-menu', { type: 'button', 'aria-expanded': 'false' });
  const burgerLabel = el('span', 'hide');
  burgerLabel.textContent = 'Open full menu';
  burger.append(burgerLabel);
  burgerBox.append(burger);
  info.append(burgerBox);
  block.append(info);

  burgerBox.addEventListener('click', () => {
    block.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', block.classList.contains('menu-open'));
  });
  if (menuHeading) {
    menuHeading.addEventListener('click', () => {
      block.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  }
  DESKTOP.addEventListener('change', () => {
    block.classList.remove('menu-open', 'is-hover');
  });

  bindMenu(block, gnb);
}
