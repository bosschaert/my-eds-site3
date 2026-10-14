import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL = ['facebook', 'twitter', 'linkedin', 'instagram'];

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

/**
 * Moves an authored link's child nodes into a visually hidden span (accessible name kept).
 * @param {Element} a the authored link
 */
function hideLabel(a) {
  const label = el('span', 'sr-only');
  label.append(...a.childNodes);
  a.append(label);
}

/**
 * Decorates an authored social link list: glyph span + hidden label.
 * @param {Element} ul authored list
 */
function decorateSocial(ul) {
  ul.className = 'social';
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const wrap = li.querySelector(':scope > p');
    if (wrap && wrap.querySelector('a')) wrap.replaceWith(...wrap.childNodes);
    const a = li.querySelector('a');
    if (!a) return;
    const network = SOCIAL.find((n) => a.href.includes(n)) || '';
    a.removeAttribute('title');
    hideLabel(a);
    a.prepend(el('span', `social-icon ${network}`, { 'aria-hidden': 'true' }));
  });
}

/**
 * loads and decorates the footer: one column per authored section (logo | social + legal)
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const root = el('div', 'site-footer');
  const mainBand = el('div', 'site-footer-main');
  const container = el('div', 'container');
  const row = el('div', 'site-footer-row');
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  sections.forEach((section, i) => {
    const col = el('div', `site-footer-col${i === sections.length - 1 && i > 0 ? ' site-footer-col-end' : ''}`);
    const content = section.querySelector('.default-content-wrapper') || section;
    content.querySelectorAll('ul').forEach((ul) => {
      if ([...ul.querySelectorAll('a')].every((a) => SOCIAL.some((n) => a.href.includes(n)))) {
        decorateSocial(ul);
      }
    });
    content.querySelectorAll('a').forEach((a) => a.removeAttribute('title'));
    // a logo link (first column, link-only paragraph) shows the council mark
    if (i === 0) {
      const logo = content.querySelector('p > a:only-child');
      if (logo && !logo.querySelector('img, picture')) {
        logo.classList.add('site-footer-logo');
        hideLabel(logo);
        logo.prepend(el('img', '', {
          src: `${window.hlx.codeBasePath}/blocks/footer/fcc-logo.svg`,
          alt: '',
          width: '179',
          height: '66',
        }));
      }
    }
    col.append(...content.childNodes);
    row.append(col);
  });
  container.append(row);
  mainBand.append(container);
  root.append(mainBand, el('div', 'site-footer-base'));

  block.textContent = '';
  block.append(root);
}
