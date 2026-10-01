/**
 * Footer — template-slotted replica of the balbriggan.ie footer (stardust/prototypes
 * index-proposed.template.html `#wrapper-footer-full` + `#wrapper-footer`).
 *
 * Content comes from the authored /footer document, classified by role: the section
 * carrying an icon/picture is the Fingal County Council logo widget; the section with the
 * social list (and the Privacy link) is the custom-html widget. Authored nodes are MOVED
 * into the prototype's DOM (EW1). The source's `#wrapper-footer .site-info` is empty on the
 * captured page and is emitted empty.
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_HOSTS = [
  ['facebook.com', 'facebook'],
  ['twitter.com', 'twitter'],
  ['x.com', 'twitter'],
  ['linkedin.com', 'linkedin'],
  ['instagram.com', 'instagram'],
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function socialNetwork(href) {
  try {
    const host = new URL(href, window.location.href).hostname.replace(/^www\./, '');
    const hit = SOCIAL_HOSTS.find(([h]) => host === h || host.endsWith(`.${h}`));
    return hit ? hit[1] : null;
  } catch (e) {
    return null;
  }
}

function decorateSocialList(ul) {
  ul.classList.add('list-inline', 'list-social');
  [...ul.children].forEach((li) => {
    li.classList.add('list-inline-item');
    const a = li.querySelector(':scope > a, :scope > p > a');
    if (!a) return;
    if (a.parentElement.tagName === 'P') a.parentElement.replaceWith(...a.parentElement.childNodes);
    const network = socialNetwork(a.getAttribute('href'));
    a.classList.add('social-icon');
    // the source anchors carry no text: the authored label becomes the accessible name
    const label = a.textContent.trim();
    if (label && !a.hasAttribute('aria-label')) a.setAttribute('aria-label', label);
    a.replaceChildren();
    if (network) a.append(el('i', `fa fa-${network}`, { 'aria-hidden': 'true' }));
  });
  return ul;
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

  const sections = [...fragment.children];
  const logoSection = sections.find((s) => s.querySelector('.icon, picture, img'));
  const htmlSection = sections.find((s) => s !== logoSection && s.querySelector('a[href]'));

  const full = el('div', 'wrapper footer-full');
  const container = el('div', 'container');
  const row = el('div', 'row');
  const imageWidget = el('div', 'footer-widget widget-media-image col-md-6');
  const htmlWidget = el('div', 'footer-widget widget-custom-html col-md-6');
  const textwidget = el('div', 'textwidget custom-html-widget');

  if (logoSection) {
    const link = logoSection.querySelector('a[href]');
    const img = logoSection.querySelector('img');
    if (img) {
      img.classList.add('image');
      img.alt = 'Fingal County Council';
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    if (link) {
      link.title = link.title || 'Fingal County Council';
      imageWidget.append(link);
    }
  }

  if (htmlSection) {
    const ul = htmlSection.querySelector('ul');
    if (ul) textwidget.append(decorateSocialList(ul));
    [...htmlSection.querySelectorAll('p')].forEach((p) => {
      if (p.querySelector('a[href]')) textwidget.append(p);
    });
  }

  htmlWidget.append(textwidget);
  row.append(imageWidget, htmlWidget);
  container.append(row);
  full.append(container);

  const bottom = el('div', 'wrapper footer-bottom');
  const siteFooter = el('div', 'site-footer');
  siteFooter.append(el('div', 'site-info'));
  const bottomCol = el('div', 'col-md-12');
  bottomCol.append(siteFooter);
  const bottomRow = el('div', 'row');
  bottomRow.append(bottomCol);
  const bottomContainer = el('div', 'container');
  bottomContainer.append(bottomRow);
  bottom.append(bottomContainer);

  block.replaceChildren(full, bottom);
}
