import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Collects the authored nav links. The authored/harness shape is `<li><a>`; the live
 * pipeline wraps the link in a paragraph, `<li><p><a>` (#98) — both shapes are matched.
 * Falls back to every link in the document when no list was authored.
 * @param {Element} fragment The loaded /nav fragment
 * @returns {HTMLAnchorElement[]} the authored anchors, in document order
 */
function collectNavLinks(fragment) {
  const links = [...fragment.querySelectorAll('ul > li')]
    .map((li) => li.querySelector(':scope > a, :scope > p > a'))
    .filter(Boolean);
  return links.length ? links : [...fragment.querySelectorAll('a[href]')];
}

/**
 * Loads and decorates the header: the source's `<nav class="site-header">` with its
 * links shown inline at every width (no hamburger — the source nav never collapses,
 * and the prototype passed the 360px gate that way).
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // build the prototype's chrome DOM and move the authored anchors into it (EW: never rebuild)
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.className = 'site-header';
  nav.setAttribute('aria-label', 'Site');

  if (fragment) {
    collectNavLinks(fragment).forEach((link) => {
      link.className = 'site-header-link';
      nav.append(link);
    });
  }

  block.append(nav);
}
