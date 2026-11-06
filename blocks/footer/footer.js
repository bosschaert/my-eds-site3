import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer: the <footer> element itself becomes the source's
 * .site-footer box; the authored /footer content is moved in unchanged.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = block.closest('footer');
  if (footer) footer.classList.add('site-footer');

  const content = document.createElement('div');
  if (fragment) {
    fragment.querySelectorAll(':scope > .section > div').forEach((wrapper) => {
      while (wrapper.firstChild) content.append(wrapper.firstChild);
    });
  }
  block.textContent = '';
  block.append(content);
}
