import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header chrome for the niravmanubhai.com replica, template-slotted from the authored /nav
 * document: section 1 = brand (home link + site title), section 2 = the drawer link list
 * (one <ul>; a group label is an <li> whose <p> precedes a nested <ul>), section 3 = tools
 * (none). The reading-progress bar, the drawer overlay and the back-to-top button are
 * body-level chrome created here (idempotently, EW9). Observed live motion re-authored:
 * drawer `open` toggle (button / close / overlay / Escape), back-to-top `show` past 500px,
 * reading progress width = scrollY / (scrollHeight - innerHeight), rAF-ticked.
 */

const DRAWER_ID = 'nmh-drawer';
const TOP_THRESHOLD = 500;

// current body-level chrome; one window listener set serves every decorate() run (EW9)
const state = {
  fill: null, top: null, ticking: false, wired: false,
};

function create(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

/**
 * #98: the pipeline wraps a list item's link in <p>; normalise to <li><a>.
 * Also strips any button decoration — chrome links are never buttons.
 * @param {Element} root
 */
function normaliseLinks(root) {
  root.querySelectorAll('a.button').forEach((a) => {
    a.className = '';
    const p = a.closest('p');
    if (p) p.classList.remove('button-wrapper', 'button-container');
  });
  root.querySelectorAll('li > p').forEach((p) => {
    const a = p.querySelector(':scope > a');
    if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
      p.replaceWith(a);
    }
  });
  root.querySelectorAll('a[href]').forEach((a) => {
    try {
      const url = new URL(a.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname) {
        a.setAttribute('aria-current', 'page');
      }
    } catch (e) {
      // not a URL we can compare
    }
  });
}

function updateProgress() {
  state.ticking = false;
  const { fill } = state;
  if (!fill || !fill.isConnected) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  fill.style.width = `${(ratio * 100).toFixed(2)}%`;
}

function onScroll() {
  if (state.top && state.top.isConnected) {
    state.top.classList.toggle('show', window.scrollY > TOP_THRESHOLD);
  }
  if (!state.ticking) {
    state.ticking = true;
    window.requestAnimationFrame(updateProgress);
  }
}

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Creates (once per body) the reading-progress bar, the drawer overlay and the
 * back-to-top button as direct children of <body>.
 */
function ensureBodyChrome() {
  const { body } = document;
  let progress = body.querySelector(':scope > .nm-reading-progress');
  if (!progress) {
    progress = create('div', 'nm-reading-progress', { 'aria-hidden': 'true' });
    progress.append(document.createElement('span'));
    body.prepend(progress);
  }
  let overlay = body.querySelector(':scope > .nmh-overlay');
  if (!overlay) {
    overlay = create('div', 'nmh-overlay', { 'aria-hidden': 'true' });
    body.append(overlay);
  }
  let top = body.querySelector(':scope > .nm-top');
  if (!top) {
    top = create('button', 'nm-top', { type: 'button', 'aria-label': 'Back to top' });
    top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<path d="M6 15l6-6 6 6"></path></svg>';
    top.addEventListener('click', scrollToTop);
    body.append(top);
  }
  state.fill = progress.querySelector('span');
  state.top = top;
  if (!state.wired) {
    state.wired = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
  onScroll();
  return { overlay, top };
}

/**
 * Builds the header row: home link | site title | menu button.
 * @param {Element|undefined} brand the authored brand section
 */
function buildHeaderRow(brand) {
  const row = create('div', 'nmh-header');
  const home = create('div', 'nmh-home');
  const title = create('div', 'nmh-title');
  if (brand) {
    const link = brand.querySelector('a[href]');
    if (link) home.append(link.closest('p') || link);
    const titleEl = [...brand.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
      .find((el) => !el.querySelector('a') && el.textContent.trim());
    if (titleEl) {
      // the live header carries the title as <span class="nmh-title-property">; the pipeline
      // authors it as <p> — same computed style, tag parity for chrome-parity
      const span = create('span', 'nmh-title-property');
      span.append(...titleEl.childNodes);
      title.append(span);
    }
  }
  const button = create('button', 'nmh-menu-btn', {
    type: 'button',
    'aria-label': 'Open menu',
    'aria-controls': DRAWER_ID,
    'aria-expanded': 'false',
  });
  button.textContent = '☰';
  row.append(home, title, button);
  return { row, button };
}

/**
 * Builds the drawer from the authored link list. Group labels (an <li> with a <p> before a
 * nested <ul>) are wrapped in div.nmh-menu-group; links are moved, never rebuilt (EW1).
 * @param {Element|undefined} sections the authored link-list section
 */
function buildDrawer(sections) {
  const drawer = create('nav', 'nmh-menu', { id: DRAWER_ID, 'aria-label': 'Site navigation' });
  const close = create('button', 'nmh-menu-close', { type: 'button', 'aria-label': 'Close menu' });
  close.textContent = '×';
  drawer.append(close);
  if (sections) {
    normaliseLinks(sections);
    sections.querySelectorAll('li').forEach((li) => {
      const sub = li.querySelector(':scope > ul, :scope > ol');
      if (!sub) return;
      const label = li.querySelector(':scope > p');
      if (label) {
        const group = create('div', 'nmh-menu-group');
        label.before(group);
        group.append(label);
      }
    });
    const listSelector = ':scope > div > ul, :scope > div > ol, :scope > ul, :scope > ol';
    const lists = [...sections.querySelectorAll(listSelector)];
    if (lists.length) {
      drawer.append(...lists);
    } else {
      // harness-only fallback: no list authored — move whatever default content exists
      const wrapper = sections.querySelector('.default-content-wrapper') || sections;
      drawer.append(...wrapper.children);
    }
  }
  return { drawer, close };
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const sections = fragment ? [...fragment.children] : [];
  const brand = sections[0];
  const linkSection = sections.find((s, i) => i > 0 && s.querySelector('ul, ol'))
    || sections[1];
  if (brand) normaliseLinks(brand);

  const { row, button } = buildHeaderRow(brand);
  const { drawer, close } = buildDrawer(linkSection);
  block.replaceChildren(row);
  // the sticky <header> host is a stacking context (z-index 20): the drawer must sit at
  // body level, above the body-level overlay, exactly as on the source
  document.body.querySelectorAll(':scope > .nmh-menu').forEach((old) => old.remove());
  document.body.append(drawer);

  const { overlay } = ensureBodyChrome();

  const isOpen = () => drawer.classList.contains('open');
  const setOpen = (open) => {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      close.focus();
    } else if (drawer.contains(document.activeElement)) {
      button.focus();
    }
  };

  button.addEventListener('click', () => setOpen(!isOpen()));
  close.addEventListener('click', () => setOpen(false));
  overlay.addEventListener('click', () => setOpen(false));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });
  drawer.addEventListener('focusout', (e) => {
    const next = e.relatedTarget;
    if (isOpen() && next && !drawer.contains(next) && next !== button) setOpen(false);
  });
}
