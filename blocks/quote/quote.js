/**
 * quote — the source c-quote (portrait in a circle, large quote mark, quote text, author),
 * alone or beside an image column (source has-columns row, col-12 col-sm-6 mb-5).
 *
 * Content: one row per column. A cell holding a <blockquote> is the quote column:
 *   <p><img portrait></p>? <blockquote><p>text</p></blockquote> <p>author</p>
 * any other cell is an image column (<p><img></p> + caption / creator <p>s).
 * Variants: static, alt-icon („ above the text), image-left, dark (black text), yellow.
 * Decoration (template-slotted): authored nodes are MOVED into the slots (EW1); the quote mark
 * is CSS chrome. Re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

function quoteColumn(cell) {
  const quote = el('div', 'quote-box');
  const bq = cell.querySelector('blockquote');
  const imgP = [...cell.children].find((c) => c !== bq && c.querySelector('img, picture'));
  if (imgP) quote.append(el('div', 'quote-image-container', imgP));
  const textBox = el('div', 'quote-text-container');
  textBox.append(el('div', 'quote-text', ...bq.childNodes));
  bq.remove();
  const rest = [...cell.children].filter((c) => c.textContent.trim());
  if (rest.length) textBox.append(el('div', 'quote-author', ...rest));
  quote.append(textBox);
  return quote;
}

export default function decorate(block) {
  if (block.querySelector('.quote-column')) return;
  const rows = [...block.children];
  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const col = el('div', 'quote-column');
    if (cell.querySelector('blockquote')) {
      col.classList.add('is-quote');
      col.append(quoteColumn(cell));
    } else {
      col.classList.add('is-image');
      col.append(...cell.childNodes);
    }
    row.replaceWith(col);
  });
  if (rows.length > 1) block.classList.add('has-columns');
}
