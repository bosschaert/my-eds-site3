/**
 * Header — template-slotted chrome for www.niravmanubhai.com (stardust:replica).
 *
 * Slots the authored /nav document into the source chrome DOM: the `.nmh-header` bar
 * (section 1: home link + property title, plus the menu button), the `.nmh-menu` drawer
 * (section 2: link lists and group labels) with its overlay and close button, the
 * `.nm-reading-progress` bar and the `.nm-top` back-to-top button. As on the live page the
 * overlay and the drawer <nav> sit right AFTER <header> (a body-level `.header-drawer` host), not
 * inside it; the live page has no skip link, so none is added.
 * Interaction mirrors the live site's own scripts: the menu button toggles `.open` on the
 * drawer and overlay; overlay click, close button and Escape close it; the back-to-top button
 * shows above 500px of scroll and the progress bar fills to the scrolled share.
 * Authored elements are MOVED into the template (EW1); buttons carry aria-labels and glyphs
 * only (EW7); decorate() is re-entrant (EW9) — window/document listeners drop themselves once
 * their elements leave the DOM.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  node.append(...children);
  return node;
}

function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M6 15l6-6 6 6');
  svg.append(path);
  return svg;
}

function readMeta(name) {
  const meta = document.head.querySelector(`meta[name="${name}"]`);
  return meta ? meta.getAttribute('content') : '';
}

/** The authored elements of one nav section (runtime `.default-content-wrapper` or a raw cell). */
function authoredItems(section) {
  const wrappers = section.querySelectorAll('.default-content-wrapper');
  if (wrappers.length) return [...wrappers].flatMap((wrapper) => [...wrapper.children]);
  return [...section.children];
}

/**
 * Sections of the nav document. At runtime the block arrives with one empty row and the
 * document is fetched as a fragment; in the local harness the authored rows are already in place.
 */
async function loadSections(block) {
  const rows = [...block.children];
  const authored = rows.some((row) => row.querySelector('a, p, ul, ol, picture, img')
    || row.textContent.trim());
  if (authored) return rows.map((row) => row.firstElementChild || row);
  const navMeta = readMeta('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const { loadFragment } = await import('../fragment/fragment.js');
  const fragment = await loadFragment(navPath);
  return fragment ? [...fragment.children] : [];
}

function wireDrawer(button, menu, overlay, closeButton) {
  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
  };
  const close = () => setOpen(false);
  button.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  overlay.addEventListener('click', close);
  closeButton.addEventListener('click', close);
  const onKey = (e) => {
    if (!menu.isConnected) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey);
}

function wireScroll(topButton, fill) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
  });
  const tick = () => {
    if (!topButton.isConnected) {
      window.removeEventListener('scroll', tick);
      return;
    }
    topButton.classList.toggle('show', window.scrollY > 500);
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const share = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    fill.style.width = `${(share * 100).toFixed(2)}%`;
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/**
 * Loads and decorates the header.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const [brandSection, menuSection] = await loadSections(block);
  const brandItems = brandSection ? authoredItems(brandSection) : [];
  const menuItems = menuSection ? authoredItems(menuSection) : [];

  const progress = el('div', { class: 'nm-reading-progress', 'aria-hidden': 'true' }, el('span'));
  const rule = el('div', { class: 'nmh-top-rule', 'aria-hidden': 'true' });

  const bar = el('div', { class: 'nmh-header' });
  const home = el('div', { class: 'nmh-home' });
  const title = el('div', { class: 'nmh-title' });
  brandItems.forEach((item) => (item.querySelector('a') ? home : title).append(item));
  // the home link is a plain link, whatever an older runtime may have buttonized it into
  home.querySelectorAll('.button, .button-wrapper, .button-container').forEach((node) => {
    node.className = '';
  });
  const menuButton = el('button', {
    class: 'nmh-menu-btn',
    type: 'button',
    'aria-label': 'Open menu',
    'aria-controls': 'nmh-drawer',
    'aria-expanded': 'false',
  }, '☰');
  bar.append(home, title, menuButton);

  const overlay = el('div', { class: 'nmh-overlay', 'aria-hidden': 'true' });
  const menu = el('nav', { class: 'nmh-menu', id: 'nmh-drawer', 'aria-label': 'Site navigation' });
  const closeButton = el('button', { class: 'nmh-menu-close', type: 'button', 'aria-label': 'Close menu' }, '×');
  menu.append(closeButton, ...menuItems);

  const topButton = el('button', { class: 'nm-top', type: 'button', 'aria-label': 'Back to top' }, arrowIcon());

  block.replaceChildren(progress, rule, bar, topButton);

  // drawer host after <header>, as on the live page (re-entrant: an earlier host is replaced)
  document.querySelectorAll('.header-drawer').forEach((old) => old.remove());
  const host = block.closest('header') || block;
  host.insertAdjacentElement('afterend', el('div', { class: 'header-drawer' }, overlay, menu));

  wireDrawer(menuButton, menu, overlay, closeButton);
  wireScroll(topButton, progress.firstElementChild);
}
