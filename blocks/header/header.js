import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header: the /nav fragment's links, moved (never rebuilt)
 * into a single <nav class="site-header">, as on the source. No controls.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const nav = document.createElement('nav');
  nav.className = 'site-header';
  nav.setAttribute('aria-label', 'Main');
  if (fragment) {
    fragment.querySelectorAll('a[href]').forEach((a) => {
      a.removeAttribute('title');
      a.removeAttribute('class');
      nav.append(a);
    });
  }

  const wrapper = document.createElement('div');
  wrapper.append(nav);
  block.textContent = '';
  block.append(wrapper);
}
