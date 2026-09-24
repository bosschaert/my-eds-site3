import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads the authored /nav document and slots its links into the source's
 * chrome DOM: <nav class="site-header"><a>…</a><a>…</a></nav>.
 * The source nav has no hamburger at any width, so no menu machinery is needed.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const nav = document.createElement('nav');
  nav.className = 'site-header';
  nav.setAttribute('aria-label', 'Main');

  if (fragment) {
    // the pipeline may wrap a list item's link in <p> on live: select both shapes
    const links = [...fragment.querySelectorAll('li > a, li > p > a')];
    if (links.length) {
      // node-slotting: move the authored <a> elements themselves
      links.forEach((a) => nav.append(a));
    } else {
      // defensive: no list authored — slot any authored links in document order
      fragment.querySelectorAll('a').forEach((a) => nav.append(a));
    }
  }

  block.textContent = '';
  block.append(nav);
}
