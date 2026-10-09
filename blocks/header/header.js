import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * The source page has no header. The nav document (/nav, or the page's `nav` metadata)
 * is still resolved so the chrome contract stays intact, but nothing is rendered and a
 * missing or empty document is tolerated: the header stays a zero-height host.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  try {
    await loadFragment(navPath);
  } catch (e) {
    // no nav document: nothing to render either way
  }
  block.textContent = '';
  block.setAttribute('aria-hidden', 'true');
}
