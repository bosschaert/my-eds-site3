/*
 * Footer block — Garden Eight replica of the source site's footer bar (.Sm / .Sm-b).
 * Reads /footer (4 sections, in order: logo, address, sns, mail) through loadFragment and
 * renders the bar with its four slots. After decorating, the block's wrapper is moved into
 * the page's closing dark band (main .section.footer-band) when that section exists, so the
 * bar renders inside the band as on the source site; otherwise it stays in body > footer.
 * Authored p/ul/li/a nodes are moved with append() and styled through wrapper selectors;
 * decorate() is re-entrant (the block is rebuilt from the fragment on every call).
 *
 * @ew-exempt accessible name of the logo link — "Garden Eight" (the icon title) is a code
 *   constant set as the logo link's aria-label
 * @ew-exempt UI state labels — "Copy to clipboard" / "Copied" of the mail control are code
 *   constants; the authored address stays the visible label
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { observeReveals } from '../../scripts/motion.js';

const LOGO_LABEL = 'Garden Eight';
const COPY_LABEL = 'Copy to clipboard';
const COPIED_LABEL = 'Copied';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/** The default content of fragment section i (its wrapper), or null. */
function sectionContent(fragment, i) {
  const section = fragment.children[i];
  if (!section) return null;
  return section.querySelector('.default-content-wrapper') || section;
}

/**
 * Builds the mail control (.ui-btn-mail) around the authored <p>M : <a>address</a></p>.
 * As on the source, the whole control is ONE link: the leading text node moves into the
 * .h slot inside the authored link, the link's own text becomes the first line of the
 * .label clip, followed by the two state lines. The link keeps its authored href and
 * stays the editable node (no class on it; the wrapper carries .ui-btn-mail).
 * @param {Element} p the authored paragraph
 */
function buildMail(p) {
  const link = p.querySelector('a');
  if (!link) return;
  const h = el('span', 'h w400');
  const hO = el('span', 'o');
  const hT = el('span', 't');
  while (p.firstChild && p.firstChild !== link) hT.append(p.firstChild);
  hO.append(hT);
  h.append(hO);
  const label = el('span', 'label');
  const labelO = el('span', 'o');
  const addressT = el('span', 't');
  while (link.firstChild) addressT.append(link.firstChild);
  labelO.append(addressT);
  [[COPY_LABEL, 'state-copy'], [COPIED_LABEL, 'state-copied']].forEach(([text, cls]) => {
    const t = el('span', `t ${cls}`);
    t.textContent = text;
    labelO.append(t);
  });
  label.append(labelO);
  link.append(h, label);
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

  const bar = el('div', 'footer-bar');
  const barBody = el('div', 'footer-bar-b');
  const hr = el('div', 'hr show-m');
  hr.append(el('div'));

  // logo slot: the authored <p><a>:logovr:</a></p>
  const logo = el('div', 'footer-logo');
  const logoContent = sectionContent(fragment, 0);
  if (logoContent) logo.append(...logoContent.children);
  const logoLink = logo.querySelector('a');
  if (logoLink) logoLink.setAttribute('aria-label', LOGO_LABEL);

  // address slot: the authored paragraphs (©, FAQ, PATIO)
  const address = el('div', 'footer-address clip-y');
  const addressContent = sectionContent(fragment, 1);
  if (addressContent) address.append(...addressContent.children);

  // sns slot: the authored <ul>
  const sns = el('div', 'footer-sns');
  const snsContent = sectionContent(fragment, 2);
  if (snsContent) sns.append(...snsContent.children);

  // mail slot: the authored <p> inside the copy-to-clipboard control
  const mail = el('div', 'footer-mail');
  const mailContent = sectionContent(fragment, 3);
  if (mailContent) {
    const control = el('div', 'ui-btn-mail');
    control.append(...mailContent.children);
    const p = control.querySelector('p');
    if (p) buildMail(p);
    control.addEventListener('click', (ev) => {
      const link = ev.target.closest('a');
      if (link) ev.preventDefault();
      const addressText = (control.querySelector('.label .t') || {}).textContent || '';
      if (navigator.clipboard && addressText.trim()) {
        navigator.clipboard.writeText(addressText.trim()).catch(() => {});
      }
      control.classList.add('copied');
    });
    mail.append(control);
  }

  barBody.append(hr, logo, address, sns, mail);
  bar.append(barBody);
  block.append(bar);

  // relocation: the bar renders inside the page's closing dark band when the page has one
  const band = document.querySelector('main .section.footer-band');
  const wrapper = block.parentElement;
  if (band && wrapper && wrapper.parentElement !== band) band.append(wrapper);

  observeReveals(block);
}
