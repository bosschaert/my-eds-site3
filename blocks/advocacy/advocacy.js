/**
 * advocacy — partnership band: photo panel (with the partner logo over it on desktop) beside a
 * tinted text panel (heading, text, CTA). On mobile the logo heads the text panel.
 *
 * Authoring (one row, two cells):
 *   1. photo: desktop <img>, then mobile <img>
 *   2. content: partner logo <img>, heading, text paragraph, CTA link paragraph
 *      (link title = accessible name)
 * Cells are classified by content (the content cell holds the heading).
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
  const contentCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[cells.length - 1];
  const photoCell = cells.find((c) => c !== contentCell && c.querySelector('picture, img'));

  const container = wrapNode(null, 'advocacy-container');
  const image = wrapNode(null, 'advocacy-image');
  if (photoCell) image.append(imageSet(mediaOf(photoCell), 'advocacy-photo'));
  const content = wrapNode(null, 'advocacy-content');
  if (contentCell) {
    const logo = mediaOf(contentCell)[0];
    if (logo) content.append(wrapNode(logo, 'advocacy-logo'));
    [...contentCell.children].forEach((n) => {
      if (n.matches('h1, h2, h3, h4, h5, h6')) {
        content.append(wrapNode(n, 'advocacy-heading'));
      } else if (n.querySelector('a')) {
        const a = n.querySelector('a');
        if (a.title && a.title !== a.textContent) a.setAttribute('aria-label', a.title);
        content.append(wrapNode(n, 'advocacy-cta'));
      } else if (n.textContent.trim()) {
        content.append(wrapNode(n, 'advocacy-text'));
      }
    });
  }
  container.append(image, content);
  block.replaceChildren(container);
}
