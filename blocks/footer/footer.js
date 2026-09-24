import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function stripIds(node) {
  node.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  return node;
}

/**
 * Normalizes the authored footer nav list (same contract as the header):
 * live DECODE (#98) unwraps <p>-wrapped trigger links; an item with a nested list keeps its
 * title (bare text → span, or the delivered <p>) and toggles aria-expanded (mobile accordion).
 * @param {Element} list the authored <ul>
 */
function prepareList(list) {
  list.querySelectorAll(':scope > li').forEach((item) => {
    const sub = item.querySelector(':scope > ul');
    const p = item.querySelector(':scope > p');
    if (p && !sub) {
      p.replaceWith(...p.childNodes);
      return;
    }
    if (!sub) return;
    let title = item.querySelector(':scope > p, :scope > span');
    if (!title) {
      title = el('span');
      const leading = [...item.childNodes]
        .filter((n) => n !== sub && n.nodeType === Node.TEXT_NODE);
      leading.forEach((n) => title.append(n));
      item.prepend(title);
    }
    prepareList(sub);
    item.setAttribute('aria-expanded', 'false');
    title.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });
}

/**
 * loads and decorates the footer: the source chrome DOM is built as empty slots and the
 * authored /footer elements are moved into them, one section per band
 * (contact strip · logo + company info · nav list · Instagram + copyright)
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  block.textContent = '';
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [contactSection, infoSection, navSection, snsSection] = sections;

  const root = el('div', 'l-footer');

  // band 1: contact strip
  const contact = el('div', 'l-footer-contact');
  const contactInner = el('div', 'l-footer-contact-inner');
  const txt = el('div', 'l-footer-contact-txt');
  const ttl = el('div', 'l-footer-contact-ttl');
  const desc = el('div', 'l-footer-contact-desc');
  const cta = el('div', 'l-footer-contact-cta');
  const tel = el('div', 'l-footer-contact-tel');
  const telNum = el('div', 'l-footer-contact-tel-num');
  const telClosed = el('div', 'l-footer-contact-tel-closed');
  const link = el('div', 'l-footer-contact-link');
  txt.append(ttl, desc);
  tel.append(telNum, telClosed);
  cta.append(tel, link);
  contactInner.append(txt, cta);
  contact.append(contactInner);
  if (contactSection) {
    let phase = 'ttl';
    [...contactSection.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].forEach((p) => {
      if (p.querySelector('a[href^="tel:"]')) {
        telNum.append(p);
        phase = 'closed';
      } else if (p.querySelector('a')) {
        link.append(p);
      } else if (phase === 'ttl') {
        ttl.append(p);
        phase = 'desc';
      } else if (phase === 'desc') {
        desc.append(p);
      } else {
        telClosed.append(p);
      }
    });
  }

  // bands 2–4: logo + info · nav · sns + copyright
  const inner = el('div', 'l-footer-inner');
  const left = el('div', 'l-footer-left');
  const logo = el('div', 'l-footer-logo');
  const info = el('div', 'l-footer-info');
  const company = el('div', 'l-footer-info-company');
  const address = el('div', 'l-footer-info-address');
  const snsSp = el('div', 'l-footer-sns-sp');
  const snsSpItem = el('div', 'c-sns-link');
  const menu = el('nav', 'l-global-menu');
  const right = el('div', 'l-footer-right');
  const snsPc = el('div', 'l-footer-sns-pc');
  const snsPcItem = el('div', 'c-sns-link');
  const copyright = el('div', 'l-footer-copyright');
  info.append(company, address);
  snsSp.append(snsSpItem);
  left.append(logo, info, snsSp);
  snsPc.append(snsPcItem);
  right.append(snsPc, copyright);
  inner.append(left, menu, right);

  if (infoSection) {
    const logoNode = infoSection.querySelector('picture, img');
    if (logoNode) logo.append(logoNode.closest('p') || logoNode.closest('a') || logoNode);
    [...infoSection.querySelectorAll('p')]
      .filter((p) => !p.querySelector('picture, img'))
      .forEach((p, i) => (i === 0 ? company : address).append(p));
    // the source's address joins its mobile-only break with a space on desktop
    // ("〒189-0025 東京都…"); the pipeline drops whitespace next to <br>, so a
    // whitespace text node follows each break (collapsed at a line start on mobile)
    address.querySelectorAll('br').forEach((br) => br.after(' '));
  }
  if (navSection) {
    const list = navSection.querySelector('ul');
    if (list) {
      menu.append(list);
      prepareList(list);
    }
  }
  if (snsSection) {
    [...snsSection.querySelectorAll('p')].forEach((p) => {
      if (p.querySelector('a img')) {
        // the mobile copy is a presentational clone (EW4); the authored node is the desktop one
        snsSpItem.append(stripIds(p.cloneNode(true)));
        snsPcItem.append(p);
      } else {
        copyright.append(p);
      }
    });
  }

  root.append(contact, inner);
  block.append(root);
}
