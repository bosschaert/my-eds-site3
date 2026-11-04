import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — the prototype's .nmh-footer band. Authored content comes from
 * /footer (override with `footer` metadata): section 1 = <ul> of footer links.
 * The authored <ul> is MOVED into the band (EW1) and is the flex container.
 */

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const band = document.createElement('div');
  band.className = 'nmh-footer';

  if (fragment) {
    const list = fragment.querySelector('ul');
    if (list) band.append(list);
    // leftovers: any other authored default content still renders (never silently dropped)
    [...fragment.querySelectorAll('.default-content-wrapper > *')].forEach((node) => {
      band.append(node);
    });
  }

  block.replaceChildren(band);
}
