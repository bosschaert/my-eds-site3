import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/* decorative badge art served from the code origin (never authored content) */
const BADGE_ART = '/blocks/footer/made-in-express.svg';

/**
 * Renders the fixed "Made in Adobe Express" badge (register R-03, replicated as captured).
 * Template-slotted: the authored paragraph (badge text + link) MOVES into the badge
 * template, so its workspace editor index survives (EW1–EW10). Anything else the
 * footer document carries is tolerated and not rendered.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = null;
  try {
    fragment = await loadFragment(footerPath);
  } catch (e) {
    // no footer document: nothing to render
  }
  block.textContent = '';
  if (!fragment) return;

  // the first authored text element is the badge label (authors omit and add cells)
  const label = [...fragment.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')]
    .find((el) => el.textContent.trim());
  if (!label) return;

  const badge = document.createElement('div');
  badge.className = 'brand-btn';

  const logo = document.createElement('span');
  logo.className = 'brand-logo';
  const art = document.createElement('img');
  art.src = `${window.hlx.codeBasePath}${BADGE_ART}`;
  art.alt = '';
  art.width = 25;
  art.height = 25;
  art.setAttribute('aria-hidden', 'true');
  logo.append(art);

  label.classList.add('brand-text');
  label.querySelectorAll('a').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  badge.append(logo, label);
  const wrapper = document.createElement('div');
  wrapper.className = 'made-in-express';
  wrapper.append(badge);
  block.append(wrapper);
}
