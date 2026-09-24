import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — template-slotted rebuild of the prototype chrome (replica-canon.css).
 * Authored content comes from /nav (override with `nav` metadata):
 *   section 1: <p><a href="/">Home</a></p> (home slot) + <p>Nirav Manubhai</p> (title slot)
 *   section 2: <ul> of drawer links
 * Authored nodes are MOVED into the template (EW1); nothing is rebuilt from text.
 * The drawer (overlay + nav), reading-progress bar, legacy bar and back-to-top
 * button are body-level chrome exactly as in the prototype, so their z-index
 * stacks against each other the way the prototype's does (the sticky header
 * host forms its own stacking context and would trap a nested fixed drawer).
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
let scrollBound = false;
let scrollQueued = false;
let escapeHandler = null;

function el(tag, attrs, text) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
  if (text !== undefined) node.textContent = text;
  return node;
}

/* scroll-state chrome: progress width + back-to-top past 500px (prototype thresholds) */
function updateScrollChrome() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  const fill = document.querySelector('.nm-reading-progress > span');
  const top = document.querySelector('.nm-top');
  if (fill) fill.style.width = `${(progress * 100).toFixed(2)}%`;
  if (top) top.classList.toggle('show', window.scrollY > 500);
  scrollQueued = false;
}

function bindScroll() {
  if (scrollBound) return;
  scrollBound = true;
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateScrollChrome);
      scrollQueued = true;
    }
  }, { passive: true });
}

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}

/* body-level chrome with no authored text; created once per body (EW9) */
function ensureBodyChrome() {
  const { body } = document;
  if (!body.querySelector('.nm-reading-progress')) {
    const bar = el('div', { class: 'nm-reading-progress', 'aria-hidden': 'true' });
    bar.append(el('span'));
    body.prepend(bar);
  }
  if (!body.querySelector('.nm-legacy-bar')) {
    body.append(el('div', { class: 'nm-legacy-bar', 'aria-hidden': 'true' }));
  }
  if (!body.querySelector('.nm-top')) {
    const top = el('button', { class: 'nm-top', type: 'button', 'aria-label': 'Back to top' });
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M6 15l6-6 6 6');
    svg.append(path);
    top.append(svg);
    top.addEventListener('click', scrollToTop);
    body.append(top);
  }
}

/* drawer: overlay + nav at body level; the authored <ul> is moved in */
function buildDrawer(list) {
  document.querySelectorAll('body > .nmh-overlay, body > .nmh-menu')
    .forEach((n) => n.remove());
  const overlay = el('div', { class: 'nmh-overlay', 'aria-hidden': 'true' });
  const menu = el('nav', { class: 'nmh-menu', id: 'nmh-drawer', 'aria-label': 'Site navigation' });
  const close = el('button', {
    class: 'nmh-menu-close',
    type: 'button',
    'aria-label': 'Close menu',
  }, '×');
  menu.append(close);
  if (list) menu.append(list);
  const host = document.querySelector('body > header');
  if (host) host.after(overlay, menu);
  else document.body.append(overlay, menu);
  return { overlay, menu, close };
}

/**
 * loads and decorates the header (sticky house header + drawer + scroll chrome)
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // slots
  const bar = el('div', { class: 'nmh-header' });
  const home = el('div', { class: 'nmh-home' });
  const title = el('div', { class: 'nmh-title' });
  const menuBtn = el('button', {
    class: 'nmh-menu-btn',
    type: 'button',
    'aria-label': 'Open menu',
    'aria-controls': 'nmh-drawer',
    'aria-expanded': 'false',
  }, '☰');
  bar.append(home, title, menuBtn);

  let list = null;
  if (fragment) {
    const sections = [...fragment.querySelectorAll(':scope > div')];
    const brand = sections.find((s) => s.querySelector('p') && !s.querySelector('ul'));
    if (brand) {
      [...brand.querySelectorAll('p')].forEach((p) => {
        if (p.querySelector('a')) home.append(p);
        else title.append(p);
      });
    }
    list = fragment.querySelector('ul');
  }

  block.replaceChildren(bar);

  ensureBodyChrome();
  const { overlay, menu, close } = buildDrawer(list);

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  overlay.addEventListener('click', () => setOpen(false));
  close.addEventListener('click', () => setOpen(false));
  if (escapeHandler) document.removeEventListener('keydown', escapeHandler);
  escapeHandler = (e) => { if (e.key === 'Escape') setOpen(false); };
  document.addEventListener('keydown', escapeHandler);

  bindScroll();
  updateScrollChrome();
}
