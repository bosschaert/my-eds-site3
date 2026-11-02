/**
 * split-promo — two-panel limited-edition promo: a photo panel carrying the eyebrow + heading,
 * a text panel with description + CTA, and a product cut-out overlapping both panels.
 *
 * Authoring (one row, three cells):
 *   1. panel background image: desktop <img>, then mobile <img>
 *   2. product cut-out image: desktop <img>, then mobile <img>
 *   3. text: eyebrow paragraph (before the heading), heading, description paragraph,
 *      CTA link paragraph (link title = accessible name)
 * Cells are classified by content (the text cell holds the heading).
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
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells.find((c) => c.querySelector('a'));
  const imageCells = cells.filter((c) => c !== textCell && c.querySelector('picture, img'));
  const [bgCell, productCell] = imageCells;

  const container = wrapNode(null, 'split-container');
  const content = wrapNode(null, 'split-content');
  const imageBlock = wrapNode(null, 'split-image-block');
  const leading = wrapNode(null, 'split-leading');
  const textBlock = wrapNode(null, 'split-text-block');
  const text = wrapNode(null, 'split-text');

  if (textCell) {
    const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
    let seenHeading = !heading;
    [...textCell.children].forEach((n) => {
      if (n === heading) {
        leading.append(wrapNode(n, 'split-heading'));
        seenHeading = true;
      } else if (n.querySelector('a')) {
        const a = n.querySelector('a');
        if (a.title && a.title !== a.textContent) a.setAttribute('aria-label', a.title);
        text.append(wrapNode(n, 'split-cta'));
      } else if (n.textContent.trim()) {
        if (seenHeading) text.append(wrapNode(n, 'split-desc'));
        else leading.append(wrapNode(n, 'split-eyebrow'));
      }
    });
  }
  imageBlock.append(leading);
  if (bgCell) imageBlock.append(imageSet(mediaOf(bgCell), 'split-bg'));
  textBlock.append(text);
  content.append(imageBlock, textBlock);
  container.append(content);
  if (productCell) container.append(imageSet(mediaOf(productCell), 'split-product'));
  block.replaceChildren(container);
}
