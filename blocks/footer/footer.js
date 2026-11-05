import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads the authored /footer fragment and moves its content into the site footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  if (block.querySelector('.site-footer')) return;
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  footer.className = 'site-footer';
  if (fragment) {
    fragment.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
      footer.append(...wrapper.children);
    });
  }

  block.replaceChildren(footer);
}
