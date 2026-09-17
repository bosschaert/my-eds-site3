import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  while (fragment.firstElementChild) inner.append(fragment.firstElementChild);

  inner.children[0]?.classList.add('footer-brand');
  inner.children[1]?.classList.add('footer-links');
  const brandLink = inner.querySelector('.footer-brand a');
  if (brandLink) {
    const logo = document.createElement('img');
    logo.src = '/img/balbriggan/fcc-logo.svg';
    logo.alt = '';
    brandLink.prepend(logo);
  }

  block.append(inner);
}
