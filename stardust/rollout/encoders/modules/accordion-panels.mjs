/**
 * accordion-panels — `.o-accordion` whose panels hold blocks (hub siblings: sustainability
 * "CDP" / "ECPI" panels with teaser / table rows, en-pt / pt-pt / sk-sk company documents and
 * board panels), which accordion.mjs refuses. Priority 11 (before accordion.mjs); an accordion
 * accordion.mjs can encode (all panels default content) → null (its shape stays untouched).
 * Block: accordion panels. One row per item, source order:
 *   text-only panel  → [<p>label</p>, panel html]  (as accordion.mjs)
 *   panel with block → [<p>label</p>, <p>n</p>]   the panel is the n wrappers that follow the
 *                      accordion block (each default-content run and each block counts one);
 *                      these panels' content is emitted after the block in item order.
 * Two emitted panels whose boundary would join two default-content runs into ONE wrapper → null.
 */
export const match = '.o-accordion';
export const priority = 11;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function groups($, html) {
  const frag = $('<div></div>').append(html);
  const kids = frag.children().get();
  let n = 0;
  let prevBlock = null;
  const isBlock = (k) => k.tagName === 'div' && !!$(k).attr('class');
  kids.forEach((k) => {
    const b = isBlock(k);
    if (b || prevBlock !== false) n += 1;
    prevBlock = b;
  });
  const first = kids.length ? isBlock(kids[0]) : null;
  const last = kids.length ? isBlock(kids[kids.length - 1]) : null;
  return {
    n, first, last, blocks: kids.filter(isBlock).length,
  };
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const items = $(el).children('.o-accordion__item').get();
  if (!items.length) return null;
  const rows = [];
  const after = [];
  let prevLast = null;
  for (const it of items) {
    const head = $(it).children('.o-accordion__header').first();
    const panel = $(it).children('.o-accordion__content').first();
    const label = `<p>${esc(head.text().replace(/\s+/g, ' ').trim())}</p>`;
    const html = panel.length ? ctx.walk(panel.get(0)).trim() : '';
    const g = groups($, html);
    if (!g.blocks) {
      rows.push([label, html]);
    } else {
      if (prevLast === false && g.first === false) return null;
      prevLast = g.last;
      rows.push([label, `<p>${g.n}</p>`]);
      after.push(html);
    }
  }
  if (!after.length) return null;
  return `${ctx.block('accordion', ['panels'], rows)}${after.join('')}`;
}
