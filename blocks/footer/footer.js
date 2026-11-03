import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * The SVG logo is delivered in a <picture> whose first sources are raster webp renditions;
 * drop those so the browser keeps the vector, as on the source.
 * @param {Element} scope container holding the picture
 */
function keepVector(scope) {
  scope.querySelectorAll('picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (!img || !/\.svg(\?|$)/.test(img.getAttribute('src') || '')) return;
    picture.querySelectorAll('source[type="image/webp"]').forEach((source) => source.remove());
  });
}

/**
 * loads and decorates the footer: band 1 = logo link, band 2 = social list + legal links
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  if (block.querySelector(':scope > .site-footer')) return;

  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  keepVector(fragment);

  const bands = [...fragment.querySelectorAll(':scope > .section')]
    .map((section) => section.querySelector('.default-content-wrapper'))
    .filter((wrapper) => wrapper && wrapper.children.length);
  const logoBand = bands.find((band) => band.querySelector('img'));
  const linkBands = bands.filter((band) => band !== logoBand);

  const footer = el('div', 'site-footer');
  const full = el('div', 'site-footer-full');
  const container = el('div', 'container');
  const row = el('div', 'site-footer-row');

  if (logoBand) {
    const logo = el('div', 'site-footer-col site-footer-logo');
    logo.append(...logoBand.children);
    row.append(logo);
  }

  const links = el('div', 'site-footer-col site-footer-links');
  linkBands.forEach((band) => {
    band.querySelectorAll('ul').forEach((ul) => {
      if (!ul.querySelector('.icon')) return;
      ul.classList.add('list-social');
      ul.querySelectorAll('a').forEach((a) => {
        a.target = '_blank';
        a.rel = 'noopener';
      });
      ul.querySelectorAll('span.icon').forEach((span) => {
        const name = [...span.classList].find((c) => c.startsWith('icon-')).substring(5);
        span.replaceWith(el('i', `fa fa-${name}`));
      });
    });
    links.append(...band.children);
  });
  row.append(links);

  container.append(row);
  full.append(container);
  footer.append(full, el('div', 'site-footer-colophon'));

  block.textContent = '';
  block.append(footer);
}
