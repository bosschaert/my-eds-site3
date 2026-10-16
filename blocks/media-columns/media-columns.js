/**
 * media-columns — a source has-columns grid row of textmedia CEs (each: header heading, image
 * gallery above the text, rich text), e.g. "Reifen" | "ContiTech".
 *
 * Content: one row per column — [media cell (<p><img></p> + caption / creator <p>s)]?, [text cell
 * (leading headings = the CE header, then rich text)]. Variants cols-2 | cols-3 | cols-4.
 * Decoration (template-slotted): per column header → gallery → text, the c-media order; authored
 * nodes are MOVED (EW1). Re-entrant (EW9).
 */
const HEADING = /^H[1-6]$/;

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

function gallery(cell) {
  const g = el('div', 'media-columns-gallery');
  let figure = null;
  let caption = null;
  [...cell.children].forEach((node) => {
    if (node.querySelector('picture, img') || node.matches('picture, img')) {
      figure = el('figure', 'media-columns-figure', el('div', 'media-columns-image', node));
      caption = null;
      g.append(figure);
    } else if (node.textContent.trim()) {
      if (!caption) {
        caption = el('figcaption', 'media-columns-caption');
        (figure || g).append(caption);
      }
      caption.append(node);
    }
  });
  return g;
}

export default function decorate(block) {
  // dynamics row 4: image-linked media open in the foundation lightbox (source data-lightbox)
  block.querySelectorAll('a[href]').forEach((a) => {
    if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(a.getAttribute('href')) && a.querySelector('img, picture')) a.dataset.lightbox = 'media-columns';
  });
  if (block.querySelector('.media-columns-column')) return;
  const cols = [...block.children].map((row) => {
    const col = el('div', 'media-columns-column');
    const cells = [...row.children];
    const media = cells.find((c) => c.querySelector('picture, img'));
    const textCell = cells.find((c) => c !== media);
    const header = el('div', 'media-columns-header');
    const text = el('div', 'media-columns-text s-richtext');
    if (textCell) {
      const nodes = [...textCell.children];
      let i = 0;
      while (i < nodes.length && HEADING.test(nodes[i].tagName)) {
        header.append(nodes[i]);
        i += 1;
      }
      text.append(...nodes.slice(i));
    }
    if (header.children.length) col.append(header);
    if (media) col.append(gallery(media));
    if (text.children.length) col.append(text);
    return col;
  });
  // variant adopt-next: the source's last column holds a block (e.g. a table) that cannot sit
  // in a cell — the encoder emits it right after this block; move its wrapper in as a column.
  if (block.classList.contains('adopt-next')) {
    const next = block.parentElement?.nextElementSibling;
    if (next && next.querySelector(':scope > .block, :scope > [class]')) {
      cols.push(el('div', 'media-columns-column media-columns-adopted', next));
    }
  }
  block.replaceChildren(...cols);
}
