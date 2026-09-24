/*
 * Footer block — the live #wrapper-footer-full band, template-slotted (#95): a two-column
 * Bootstrap row, the partner logo link on the left, the social list and the privacy link on
 * the right. Authored nodes are MOVED into the template (EW1); wrappers carry the classes (EW2).
 * @ew-exempt <ul> social labels (Facebook, Twitter, LinkedIn, Instagram) — icon-only anchor
 *   on live; the label moves to aria-label
 * stardust-foundation-marker: footer-v2
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_HOSTS = /facebook|twitter|x\.com|linkedin|instagram|youtube/i;

const SOCIAL_ICONS = [
  [/facebook/i, 'facebook'],
  [/twitter|x\.com/i, 'twitter'],
  [/linkedin/i, 'linkedin'],
  [/instagram/i, 'instagram'],
  [/youtube/i, 'youtube'],
];

/**
 * Live social anchors are icon-only: the authored label becomes the anchor's aria-label and a
 * FontAwesome <i class="fa fa-<network>"> glyph is the only content (no text node left behind).
 */
function iconifySocialLinks(list) {
  list.querySelectorAll('a[href]').forEach((a) => {
    const label = a.textContent.trim();
    if (label && !a.hasAttribute('aria-label')) a.setAttribute('aria-label', label);
    const [, name] = SOCIAL_ICONS.find(([re]) => re.test(a.href)) || [];
    a.textContent = '';
    if (name) {
      const icon = document.createElement('i');
      icon.className = `fa fa-${name}`;
      icon.setAttribute('aria-hidden', 'true');
      a.append(icon);
    }
  });
}

function el(tag, className) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

function isSocialList(list) {
  const links = [...list.querySelectorAll('a[href]')];
  return links.length > 0 && links.every((a) => SOCIAL_HOSTS.test(a.href));
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

  block.textContent = '';
  const container = el('div', 'container');
  const row = el('div', 'row');
  const mediaCol = el('div', 'footer-widget widget-media-image col-md-6');
  const htmlCol = el('div', 'footer-widget widget-custom-html col-md-6');
  const textWidget = el('div', 'textwidget');
  const social = el('div', 'list-social');

  // classify by content, never by position: media -> left column, social list -> icon row,
  // everything else (the privacy link and any other authored element) -> right column
  const nodes = [...fragment.querySelectorAll('.default-content-wrapper > *')];
  nodes.forEach((node) => {
    if (node.matches('ul, ol') && isSocialList(node)) {
      iconifySocialLinks(node);
      social.append(node);
    } else if (node.matches('picture, img') || node.querySelector('picture, img')) {
      mediaCol.append(node);
    } else {
      textWidget.append(node);
    }
  });
  textWidget.prepend(social);
  htmlCol.append(textWidget);
  row.append(mediaCol, htmlCol);
  container.append(row);
  block.append(container);
}
