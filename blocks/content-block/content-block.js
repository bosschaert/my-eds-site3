/**
 * content-block — the source's prose panel (a gradient card with a pink left rule, holding
 * one run of text). Template-slotted: the block div is the panel, the pipeline's row and cell
 * divs are its shells and receive the layout classes; the authored paragraph(s) stay exactly
 * where they are (EW1 — nothing is moved or rebuilt). decorate() is re-entrant (EW9).
 * @param {Element} block The content-block block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('content-block-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('content-block-body');
    });
  });
}
