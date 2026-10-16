/**
 * text-media — the source TYPO3 text & media content element (o-page__ce > c-media__header +
 * c-media__content.is-textpic: c-media__gallery + c-media__text.s-richtext).
 *
 * Content (rows in any order, one cell each):
 *   media row  — a cell holding picture(s): each picture (optionally linked) starts a figure,
 *                the paragraphs after it are its caption / creator lines.
 *   text row   — optional eyebrow <p> directly followed by a heading (c-media__meta), the leading
 *                heading run (c-media__header), then rich text (c-media__text).
 * Variants: (none) image above text | image-below | image-left / image-right (image floated in
 * the text, 50 % >= 767, 33 % >= 1023) | heading-light (light-weight header heading).
 * Template-slotted decode: every authored node is MOVED into the slots (EW1), re-entrant (EW9).
 */
const HEADING = /^H[1-6]$/;

function wrap(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

// bare text in a single-paragraph cell → its own <p> (the node itself is moved)
function cellNodes(cell) {
  return [...cell.childNodes].map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return null;
      const p = document.createElement('p');
      p.append(node);
      return p;
    }
    return node.nodeType === Node.ELEMENT_NODE ? node : null;
  }).filter(Boolean);
}

export default function decorate(block) {
  // dynamics row 4: image-linked media open in the foundation lightbox (source data-lightbox)
  block.querySelectorAll('a[href]').forEach((a) => {
    if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(a.getAttribute('href')) && a.querySelector('img, picture')) a.dataset.lightbox = 'text-media';
  });
  if (block.querySelector('.text-media-content')) return;
  const header = wrap('text-media-header');
  const content = wrap('text-media-content');
  const gallery = wrap('text-media-gallery');
  const text = wrap('text-media-text s-richtext');

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const nodes = cellNodes(cell);
      if (cell.querySelector('picture, img')) {
        let figure = null;
        let caption = null;
        nodes.forEach((node) => {
          if (node.matches('picture, img, a') || node.querySelector('picture, img')) {
            figure = wrap('text-media-figure');
            caption = null;
            const pic = wrap('text-media-image');
            pic.append(node);
            figure.append(pic);
            gallery.append(figure);
          } else {
            if (!caption) {
              caption = wrap('text-media-caption');
              (figure || gallery).append(caption);
            }
            caption.append(node);
          }
        });
        return;
      }
      let i = 0;
      if (nodes[0]?.tagName === 'P' && HEADING.test(nodes[1]?.tagName || '')) {
        const meta = wrap('text-media-meta');
        meta.append(nodes[0]);
        header.append(meta);
        i = 1;
      }
      // header-1 / header-2 (cluster-hub text-media-header.mjs): only the first N headings are
      // the CE header; a heading opening the rich text stays in the text column
      const n = [...block.classList].map((c) => /^header-(\d)$/.exec(c)).find(Boolean);
      const max = n ? i + Number(n[1]) : nodes.length;
      while (i < nodes.length && i < max && HEADING.test(nodes[i].tagName)) {
        header.append(nodes[i]);
        i += 1;
      }
      nodes.slice(i).forEach((node) => text.append(node));
    });
    row.remove();
  });

  const parts = block.classList.contains('image-below') ? [text, gallery] : [gallery, text];
  parts.filter((p) => p.childNodes.length).forEach((p) => content.append(p));
  if (header.childNodes.length) block.append(header);
  if (content.childNodes.length) block.append(content);
}
