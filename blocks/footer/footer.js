import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer chrome for the niravmanubhai.com replica, template-slotted from the authored
 * /footer document: one section holding the link row as a <ul> (one link per item).
 * Authored lists/links are moved, never rebuilt (EW1); div.nmh-footer carries the paint.
 */

/**
 * #98: the pipeline wraps a list item's link in <p>; normalise to <li><a>.
 * Also strips any button decoration — chrome links are never buttons.
 * @param {Element} root
 */
function normaliseLinks(root) {
  root.querySelectorAll('a.button').forEach((a) => {
    a.className = '';
    const p = a.closest('p');
    if (p) p.classList.remove('button-wrapper', 'button-container');
  });
  root.querySelectorAll('li > p').forEach((p) => {
    const a = p.querySelector(':scope > a');
    if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
      p.replaceWith(a);
    }
  });
  root.querySelectorAll('a[href]').forEach((a) => {
    try {
      const url = new URL(a.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname) {
        a.setAttribute('aria-current', 'page');
      }
    } catch (e) {
      // not a URL we can compare
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = document.createElement('div');
  footer.className = 'nmh-footer';
  if (fragment) {
    normaliseLinks(fragment);
    const lists = [...fragment.querySelectorAll('ul, ol')]
      .filter((l) => !l.parentElement.closest('ul, ol'));
    if (lists.length) {
      footer.append(...lists);
    } else {
      // harness-only fallback: links authored as paragraphs — move the paragraphs whole
      fragment.querySelectorAll('.default-content-wrapper').forEach((w) => {
        footer.append(...w.children);
      });
    }
  }
  block.replaceChildren(footer);
}
