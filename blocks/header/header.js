import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads the authored /nav fragment and moves its links into the site header.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  if (block.querySelector('.site-header')) return;
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const nav = document.createElement('nav');
  nav.className = 'site-header';
  nav.setAttribute('aria-label', 'Main');
  if (fragment) nav.append(...fragment.querySelectorAll('a'));

  block.replaceChildren(nav);
}
