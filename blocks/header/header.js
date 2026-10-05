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
 * loads and decorates the header, mainly the nav
 * The source site has no chrome: `/nav` is an empty document, so the block stays empty
 * (hidden by header.css) and no `nav` element, toggle or listener is created.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  if (!hasContent(fragment)) return;

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand ? navBrand.querySelector('.button') : null;
  if (brandLink) {
    brandLink.className = '';
    const brandWrapper = brandLink.closest('.button-wrapper');
    if (brandWrapper) brandWrapper.className = '';
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
