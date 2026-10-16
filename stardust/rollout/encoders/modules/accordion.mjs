/**
 * accordion — TYPO3 `.o-accordion` (items: `.o-accordion__header` label + `.o-accordion__content`
 * panel) → block `accordion`. One row per item, source order: [label, panel].
 *   label — `<p>` with the header text verbatim (the plus/minus icon is block chrome).
 *   panel — the item's content walked through the normal dispatch; it must come out as default
 *           content only (EDS blocks do not nest). A panel that walks to a block → null + WARN.
 * Every item starts closed (source default). Section ground (is-gray / is-yellow …) is styled by
 * the block CSS from the section class (white separators), no variant needed.
 */
export const match = '.o-accordion';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function encode(el, ctx) {
  const { $ } = ctx;
  const items = $(el).children('.o-accordion__item').get();
  if (!items.length) return null;
  const rows = [];
  for (const it of items) {
    const head = $(it).children('.o-accordion__header').first();
    const panel = $(it).children('.o-accordion__content').first();
    const label = `<p>${esc(head.text().replace(/\s+/g, ' ').trim())}</p>`;
    const html = panel.length ? ctx.walk(panel.get(0)).trim() : '';
    const frag = $('<div></div>').append(html);
    if (frag.children('div[class]').length) {
      ctx.warn(`accordion: panel "${head.text().trim()}" holds a block — not encoded`);
      return null;
    }
    rows.push([label, html]);
  }
  return ctx.block('accordion', [], rows);
}
