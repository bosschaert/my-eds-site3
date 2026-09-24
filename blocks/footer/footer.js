import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads the authored /footer document and slots its paragraph(s) into the
 * source's chrome DOM: <footer class="site-footer">…</footer>.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  footer.className = 'site-footer';

  if (fragment) {
    const paragraphs = [...fragment.querySelectorAll('p')];
    if (paragraphs.length) {
      // node-slotting: move the authored <p> elements themselves
      paragraphs.forEach((p) => footer.append(p));
    } else {
      // defensive: no paragraph authored — slot whatever default content exists
      fragment.querySelectorAll('.default-content-wrapper > *').forEach((el) => footer.append(el));
    }
  }

  block.textContent = '';
  block.append(footer);
}
