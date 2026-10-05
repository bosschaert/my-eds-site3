import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * True when a loaded fragment carries any authored content
 * (an empty document still decorates to an empty `.section`).
 * @param {Element|null} fragment The fragment root
 * @returns {boolean}
 */
function hasContent(fragment) {
  return !!(fragment && fragment.querySelector(':scope > div > *'));
}

/**
 * loads and decorates the footer
 * The source site has no chrome: `/footer` is an empty document, so the block stays empty.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  if (!hasContent(fragment)) return;

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
