/**
 * Footer block — myastrazeneca.ch (FR) `.site-footer-wrap`, template-slotted from /footer.
 *
 * /footer sections (default content only): 1 = brand column (logo link + legal paragraph),
 * every following section = one link column (one <p><a> per link). decorate() builds the
 * prototype's footer DOM as EMPTY slot wrappers and MOVES the authored nodes into them (EW1).
 * @param {Element} block The footer block element
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Creates an element with a class attribute.
 * @param {string} tag tag name
 * @param {string} className class attribute
 * @returns {HTMLElement}
 */
function create(tag, className) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

/**
 * Loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const wrappers = [...fragment.children]
    .filter((section) => section.firstElementChild)
    .map((section) => section.querySelector('.default-content-wrapper') || section);
  const [brand, ...linkSections] = wrappers;

  const wrap = create('div', 'site-footer-wrap');
  const footer = create('div', 'site-footer');
  const grid = create('div', 'site-footer-grid');

  // brand column: the picture-bearing paragraph is the logo, the rest is the legal text
  const brandCol = create('div', 'site-footer-col site-footer-col-brand');
  if (brand) {
    const logo = create('div', 'site-footer-logo');
    const logoImg = create('div', 'img');
    const text = create('div', 'site-footer-text');
    const body = create('div', 'site-footer-text-body');
    [...brand.children].forEach((child) => {
      const isMedia = child.matches('picture, img') || child.querySelector('picture, img');
      if (isMedia) logoImg.append(child);
      else body.append(child);
    });
    if (logoImg.firstElementChild) {
      logo.append(logoImg);
      brandCol.append(logo);
    }
    if (body.firstElementChild) {
      text.append(body);
      brandCol.append(text);
    }
  }

  // link columns (#FooterLinks)
  const linksCol = create('div', 'site-footer-col site-footer-col-links');
  const links = create('div', 'site-footer-links');
  const linksGrid = create('div', 'site-footer-links-grid');
  linkSections.forEach((section) => {
    const col = create('div', 'site-footer-links-col');
    const body = create('div', 'site-footer-text-body');
    [...section.children].forEach((child) => body.append(child));
    col.append(body);
    linksGrid.append(col);
  });
  links.append(linksGrid);
  linksCol.append(links);

  grid.append(brandCol, linksCol);
  footer.append(grid);
  wrap.append(footer);
  block.append(wrap);
}
