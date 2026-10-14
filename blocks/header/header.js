import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — template-slotted chrome (replica of the live skerriesmills.ie header).
 *
 * /nav document contract (one section per slot, in this order):
 *   1. brand   — two paragraphs, each a link to "/" holding an icon:
 *                :skerries-logo: (desktop, centred) and :skerries-mob-logo: (mobile)
 *   2. left    — <ul> of the left-hand desktop links (nested <ul> = hover dropdown)
 *   3. right   — <ul> of the right-hand desktop links; the LAST item renders as the green CTA
 *   4. tools   — one paragraph with the mobile "Book Now" link
 *   5. mobile  — <ul> of the mobile menu (nested <ul> = expandable sub-list)
 * Authored nodes are MOVED into the template (EW1), never rebuilt from text.
 */

const ICON_SIZES = {
  'skerries-logo': [146, 146, 'Skerries Mills'],
  'skerries-mob-logo': [1024, 507, 'Skerries Mills Logo'],
};

/** Unwraps the pipeline's <li><p><a> shape (#98) so every item is <li><a>[<ul>]. */
function normalizeList(list) {
  if (!list) return;
  list.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

function chevron(src) {
  const img = document.createElement('img');
  img.src = `${window.hlx.codeBasePath}/icons/${src}.svg`;
  img.alt = '';
  img.width = 24;
  img.height = 24;
  return img;
}

function sizeLogo(p) {
  const img = p?.querySelector('img[data-icon-name]');
  if (!img) return;
  const [w, h, alt] = ICON_SIZES[img.dataset.iconName] || [];
  if (w) {
    img.width = w;
    img.height = h;
    img.alt = alt;
  }
  img.loading = 'eager';
}

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children.filter(Boolean));
  return node;
}

function buildDesktopNav(section, side) {
  const nav = el('nav', `sm-nav sm-nav-${side}`);
  nav.setAttribute('aria-label', side === 'left' ? 'Primary' : 'Secondary');
  const list = section?.querySelector('ul');
  if (!list) return nav;
  normalizeList(list);
  [...list.children].forEach((li) => {
    const trigger = li.querySelector(':scope > a');
    if (trigger && li.querySelector(':scope > ul')) trigger.append(chevron('chevron-down'));
  });
  nav.append(list);
  return nav;
}

function buildMobileMenu(section) {
  const menu = el('div', 'sm-mobmenu');
  menu.id = 'menu';
  const list = section?.querySelector('ul');
  if (!list) return menu;
  normalizeList(list);
  [...list.children].forEach((li) => {
    if (!li.querySelector(':scope > ul')) return;
    const toggle = el('button', 'toggle-child', chevron('chevron-down-white'));
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    // live: the chevron swaps down/up with the sub-list state
    const flip = () => {
      const open = li.classList.toggle('show-children');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.replaceChildren(chevron(open ? 'chevron-up-white' : 'chevron-down-white'));
    };
    toggle.addEventListener('click', flip);
    // live: the parent link first opens its sub-list; once open, it navigates
    li.querySelector(':scope > a')?.addEventListener('click', (e) => {
      if (li.classList.contains('show-children')) return;
      e.preventDefault();
      flip();
    });
    li.append(toggle);
  });
  menu.append(list);
  return menu;
}

function buildBurger(menu) {
  const button = el('button', 'sm-burger', el('span'), el('span'), el('span'));
  button.type = 'button';
  button.id = 'menu-btn';
  button.setAttribute('aria-controls', 'menu');
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const open = button.classList.toggle('open');
    menu.classList.toggle('flex', open);
    button.setAttribute('aria-expanded', String(open));
  });
  return el('div', 'sm-burger-wrap', button);
}

/** live behaviour: the header gains .scrolling once scrollY reaches its own height */
function watchScroll(bar) {
  const threshold = bar.offsetHeight;
  const update = () => bar.classList.toggle('scrolling', window.scrollY >= threshold);
  window.addEventListener('scroll', update, { passive: true });
  update();
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

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => !s.querySelector('.metadata'));
  const [brand, left, right, tools, mobile] = sections;

  const brandParas = brand ? [...brand.querySelectorAll('p')] : [];
  brandParas.forEach(sizeLogo);
  const logo = el('div', 'sm-logo', brandParas[0]);
  const mobLogo = el('div', 'sm-moblogo', brandParas[1]);

  const bookBtn = el('div', 'sm-bookbtn', tools?.querySelector('p'));
  const menu = buildMobileMenu(mobile);

  const bar = el(
    'div',
    'sm-header-bar',
    buildDesktopNav(left, 'left'),
    logo,
    mobLogo,
    buildDesktopNav(right, 'right'),
    bookBtn,
    buildBurger(menu),
  );
  const header = el('div', 'sm-header', bar);

  block.replaceChildren(header, menu);
  watchScroll(header);
}
