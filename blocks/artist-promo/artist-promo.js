/**
 * artist-promo — full-width artist collaboration banner: background photo, eyebrow, signature
 * artwork (the visually hidden heading names it), short text and a CTA.
 *
 * Authoring (one row, two cells):
 *   1. background image: desktop <img>, then mobile <img>
 *   2. content: eyebrow paragraph (before the heading), signature image(s) (desktop, then mobile),
 *      heading (visually hidden - the signature image shows it), text paragraph, CTA link paragraph
 * @ew-exempt none
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

function mediaOf(el) {
  return [...el.querySelectorAll('picture, img')].filter((n) => !(n.tagName === 'IMG' && n.closest('picture')));
}

function imageSet(media, className) {
  const set = wrapNode(null, className);
  if (media.length === 1) set.append(wrapNode(media[0], 'img-all'));
  else media.forEach((m, i) => set.append(wrapNode(m, i === 0 ? 'img-desktop' : 'img-mobile')));
  return set;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const contentCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6, a')) || cells[cells.length - 1];
  const bgCell = cells.find((c) => c !== contentCell && c.querySelector('picture, img'));
  if (!contentCell) return;

  const container = wrapNode(null, 'promo-container');
  if (bgCell) container.append(imageSet(mediaOf(bgCell), 'promo-bg'));

  const content = wrapNode(null, 'promo-content');
  const heading = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
  const children = [...contentCell.children];
  const headingIndex = heading ? children.indexOf(heading) : -1;
  const signature = wrapNode(null, 'promo-signature');
  const sigMedia = mediaOf(contentCell);
  if (sigMedia.length) signature.append(imageSet(sigMedia, 'promo-signature-image'));
  if (heading) signature.append(wrapNode(heading, 'promo-heading'));

  let placedSignature = false;
  children.forEach((n, i) => {
    if (n === heading || n.querySelector('picture, img')) {
      if (!placedSignature) {
        content.append(signature);
        placedSignature = true;
      }
      return;
    }
    if (n.querySelector('a')) {
      const a = n.querySelector('a');
      if (a.title && a.title !== a.textContent) a.setAttribute('aria-label', a.title);
      content.append(wrapNode(n, 'promo-cta'));
    } else if (n.textContent.trim()) {
      const before = headingIndex >= 0 ? i < headingIndex : !placedSignature;
      content.append(wrapNode(n, before && !placedSignature ? 'promo-eyebrow' : 'promo-text'));
    }
  });
  if (!placedSignature && (heading || sigMedia.length)) content.append(signature);
  container.append(content);
  block.replaceChildren(container);
}
