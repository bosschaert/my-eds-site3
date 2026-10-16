/**
 * figure — the source image-only c-media content element (c-media__gallery > figure.c-image),
 * alone or as one column of an o-container.has-columns row.
 *
 * Content: every cell is a column (cells of one row, or rows of one cell — both read in order).
 *   image cell — picture(s) (optionally linked), each followed by its caption / creator <p>s;
 *   text cell  — any other cell: headings + rich text (the neighbouring text column).
 * One cell → a single figure at content width. Two or more → a column grid (source
 * col-12 col-sm-6 mb-5: stacked below 767, 50 % columns from 767).
 * Template-slotted decode: authored nodes are MOVED into the slots (EW1), re-entrant (EW9).
 */
const HEADING = /^H[1-6]$/;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function figureColumn(cell) {
  const col = el('div', 'figure-gallery');
  let figure = null;
  let caption = null;
  [...cell.childNodes].forEach((child) => {
    let node = child;
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return;
      const p = el('p');
      node.replaceWith(p);
      p.append(node);
      node = p;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('picture, img') || node.querySelector('picture, img')) {
      figure = el('figure', 'figure-item');
      caption = null;
      const media = el('div', 'figure-media');
      media.append(node);
      figure.append(media);
      col.append(figure);
      return;
    }
    if (!node.textContent.trim()) return;
    if (!caption) {
      caption = el('figcaption', 'figure-caption');
      (figure || col).append(caption);
    }
    caption.append(node);
  });
  return col;
}

function textColumn(cell, withMeta) {
  const col = el('div', 'figure-text');
  const header = el('div', 'figure-text-header');
  const text = el('div', 'figure-text-body s-richtext');
  const nodes = [...cell.childNodes].filter((n) => n.nodeType === Node.ELEMENT_NODE
    || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
  let i = 0;
  // meta variant (cluster-content figure-meta.mjs): a leading eyebrow <p> before the heading
  if (withMeta && nodes[0]?.tagName === 'P' && HEADING.test(nodes[1]?.tagName || '')) {
    const meta = el('div', 'figure-text-meta');
    meta.append(nodes[0]);
    header.append(meta);
    i = 1;
  }
  while (i < nodes.length && HEADING.test(nodes[i].tagName || '')) {
    header.append(nodes[i]);
    i += 1;
  }
  nodes.slice(i).forEach((n) => text.append(n));
  if (header.childNodes.length) col.append(header);
  if (text.childNodes.length) col.append(text);
  return col;
}

export default function decorate(block) {
  // dynamics row 4: image-linked media open in the foundation lightbox (source data-lightbox)
  block.querySelectorAll('a[href]').forEach((a) => {
    if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(a.getAttribute('href')) && a.querySelector('img, picture')) a.dataset.lightbox = 'figure';
  });
  if (block.querySelector('.figure-column')) return;
  const rows = [...block.children];
  const cols = rows.flatMap((row) => {
    const out = [...row.children].map((cell) => {
      const col = el('div', 'figure-column');
      col.append(cell.querySelector('picture, img')
        ? figureColumn(cell)
        : textColumn(cell, block.classList.contains('meta')));
      return col;
    });
    row.remove();
    return out;
  });
  block.classList.toggle('has-columns', cols.length > 1);
  block.append(...cols);
}
