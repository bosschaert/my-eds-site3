import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer.
 * The source site has no chrome: this block renders nothing unless a /footer
 * document (or the one named by the `footer` metadata) exists and has content.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  if (!fragment || !fragment.firstElementChild) return;

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);
}
