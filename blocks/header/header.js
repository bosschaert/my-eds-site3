/*
 * Header block — Garden Eight replica of the source site's fixed chrome.
 * Reads /nav (3 sections, in order: brand, sections, tools) through loadFragment and renders
 * the brand link fixed top-left, the nav list fixed top (right of the body padding), the
 * language switch fixed top-right and, at <= 640px, the Menu button with the full-screen
 * overlay (closed by default, closed on Escape). No scroll morph, no hover behaviour.
 * Authored p/ul/li/a nodes are moved with append() and styled through wrapper selectors;
 * decorate() is re-entrant (the block is rebuilt from the fragment on every call).
 *
 * @ew-exempt UI control label — the Menu / Close button labels are code constants (EW7)
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { observeReveals } from '../../scripts/motion.js';

const LABEL_OPEN = 'Menu';
const LABEL_CLOSE = 'Close';
const MOBILE = window.matchMedia('(max-width: 640px)');
const wired = new WeakSet();

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function setMenu(block, open) {
  block.classList.toggle('menu-open', open);
  const button = block.querySelector('.header-menu');
  if (button) button.setAttribute('aria-expanded', String(open));
}

function isOpen(block) {
  return block.classList.contains('menu-open');
}

/** The default content of fragment section i (its wrapper), or null. */
function sectionContent(fragment, i) {
  const section = fragment.children[i];
  if (!section) return null;
  return section.querySelector('.default-content-wrapper') || section;
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

  block.textContent = '';
  block.classList.remove('menu-open');

  // brand (.ui-name): the authored <p><a>
  const brand = el('div', 'header-brand');
  const brandContent = sectionContent(fragment, 0);
  if (brandContent) brand.append(...brandContent.children);

  // menu button (.ui-menu), <= 640px only
  const button = el('button', 'header-menu');
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'header-nav-wrap');
  const buttonO = el('span', 'o');
  const buttonT = el('span', 't');
  const title = el('span', 'title');
  const close = el('span', 'y');
  close.textContent = LABEL_CLOSE;
  const open = el('span', 'y');
  open.textContent = LABEL_OPEN;
  title.append(close, open);
  buttonT.append(title);
  buttonO.append(buttonT);
  button.append(buttonO);

  // language switch (.ui-navi-r / .ui-lang): the authored <ul>
  const lang = el('div', 'header-lang');
  const toolsContent = sectionContent(fragment, 2);
  if (toolsContent) lang.append(...toolsContent.children);

  // nav list (.ui-navi) inside the overlay geometry (.ui-navi-wrap / -bg / -body)
  const wrap = el('div', 'header-nav-wrap');
  wrap.id = 'header-nav-wrap';
  const bg = el('div', 'header-nav-bg');
  const body = el('div', 'header-nav-body');
  const nav = el('nav', 'header-nav clip-y');
  const navContent = sectionContent(fragment, 1);
  if (navContent) nav.append(...navContent.children);
  body.append(nav);
  wrap.append(bg, body);

  block.append(brand, button, lang, wrap);

  button.addEventListener('click', () => setMenu(block, !isOpen(block)));

  if (!wired.has(block)) {
    wired.add(block);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen(block)) setMenu(block, false);
    });
    MOBILE.addEventListener('change', (e) => {
      if (!e.matches && isOpen(block)) setMenu(block, false);
    });
  }

  observeReveals(block);
}
