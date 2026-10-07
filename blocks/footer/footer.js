import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer: the source's `<footer class="site-footer">` legal line.
 * The authored paragraphs are moved into the chrome DOM in order (EW: never rebuilt).
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'site-footer';

  if (fragment) {
    fragment.querySelectorAll(':scope > .section > div > *').forEach((node) => {
      footer.append(node);
    });
  }

  block.append(footer);
}
