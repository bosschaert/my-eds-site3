import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — template-slotted chrome (replica of the live skerriesmills.ie footer).
 *
 * /footer document contract (one section per band, in this order):
 *   1. logo     — a link to "/" holding the :skerries-footer-logo: icon
 *   2. columns  — each <h4> opens a column; the paragraphs after it are its items.
 *                 An item may lead with an icon (:map:, :envelope:, …); a paragraph of
 *                 icon-only links renders as the social row.
 *   3. partners — one paragraph per partner logo image, then the support line
 *   4. bottom   — <ul> of legal links, then the credit paragraph
 * Authored nodes are MOVED into the template (EW1), never rebuilt from text.
 */

const SOCIAL_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'Twitter',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  'tripadvisor-white': 'TripAdvisor',
};

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children.filter(Boolean));
  return node;
}

function isIconRow(p) {
  const links = [...p.querySelectorAll('a')];
  return links.length > 0
    && links.every((a) => a.querySelector('.icon') && !a.textContent.trim());
}

function buildLogo(section) {
  const wrap = el('div', 'sm-footer-logo');
  const p = section?.querySelector('p');
  if (!p) return wrap;
  const img = p.querySelector('img[data-icon-name]');
  if (img) {
    img.width = 1024;
    img.height = 121;
    img.alt = 'Skerries Mills Industrial Heritage Museum';
  }
  wrap.append(p);
  return wrap;
}

function buildSocials(p) {
  p.querySelectorAll('a').forEach((a) => {
    const img = a.querySelector('img[data-icon-name]');
    const label = img && SOCIAL_LABELS[img.dataset.iconName];
    if (label) img.alt = label;
    a.target = '_blank';
    a.rel = 'noopener';
    a.removeAttribute('title');
  });
  return el('div', 'sm-footer-socials', p);
}

function buildItem(p) {
  const icon = p.querySelector(':scope > .icon');
  const img = icon?.querySelector('img');
  if (img) img.alt = '';
  return el('div', 'sm-footer-item', icon, p);
}

function buildColumns(section) {
  const grid = el('div', 'sm-footer-grid');
  const wrapper = section?.querySelector('.default-content-wrapper');
  if (!wrapper) return el('div', 'sm-footer-cols sm-wrap', grid);
  let col = null;
  // capture the children before moving them (moving ends a live sibling walk — EW1)
  [...wrapper.children].forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName) || !col) {
      col = el('div', 'sm-footer-col');
      grid.append(col);
    }
    if (/^H[1-6]$/.test(node.tagName)) col.append(node);
    else if (node.tagName === 'P' && isIconRow(node)) col.append(buildSocials(node));
    else if (node.tagName === 'P') col.append(buildItem(node));
    else col.append(node);
  });
  return el('div', 'sm-footer-cols sm-wrap', grid);
}

function buildPartners(section) {
  const logos = el('div', 'sm-footer-logos');
  const support = el('div', 'sm-footer-support');
  const wrapper = section?.querySelector('.default-content-wrapper');
  [...(wrapper?.children || [])].forEach((node) => {
    if (node.querySelector('picture, img')) logos.append(el('div', '', node));
    else support.append(node);
  });
  return el('div', 'sm-footer-partners sm-wrap', logos, support.children.length ? support : null);
}

function buildBottom(section) {
  const row = el('div', 'sm-footer-bottom-row');
  const wrapper = section?.querySelector('.default-content-wrapper');
  [...(wrapper?.children || [])].forEach((node) => {
    if (node.tagName === 'UL') {
      node.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
      row.append(el('div', 'sm-footer-legal', node));
    } else {
      row.append(el('div', 'sm-footer-credit', node));
    }
  });
  return el('div', 'sm-footer-bottom sm-wrap', row);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => !s.querySelector('.metadata'));
  const [logo, columns, partners, bottom] = sections;

  const body = el(
    'div',
    'sm-footer-body',
    buildLogo(logo),
    buildColumns(columns),
    buildPartners(partners),
    buildBottom(bottom),
  );
  block.replaceChildren(el('div', 'sm-footer', el('div', 'sm-footer-grass'), body));
}
