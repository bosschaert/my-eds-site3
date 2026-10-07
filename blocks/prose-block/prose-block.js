/**
 * prose-block — the highlighted prose card (the source's `div:not(...)` rule).
 * Schema: stardust/eds-schema/index.json section 2 (1 item, no repeats).
 * Decode tier: template-slotted — one authored cell, moved as is; the block is
 * the card, the authored paragraph(s) stay where they are (EW1/EW2).
 *
 * Authoring: ONE row, ONE cell holding the paragraph(s).
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell) => {
    cell.className = 'prose-block-body';
  });
  block.replaceChildren(...cells);
}
