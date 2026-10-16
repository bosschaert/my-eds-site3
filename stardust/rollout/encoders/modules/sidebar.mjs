/**
 * sidebar — `.o-container__content > .row` holding a main column and `.o-container__sidebar`
 * (IR contact, Vitesco spin-off pages). Priority 30 (claims the row before its contents).
 * Emits: the main column walked (default content + blocks), then block `sidebar` whose single
 * cell carries the sidebar's DEFAULT content (empty cell when the sidebar is empty or holds
 * only blocks), then the sidebar's blocks (content-list …) — the block JS moves itself and the
 * wrappers after it into the aside column. A sidebar mixing blocks and default content keeps
 * the default content in the cell and the blocks after it (order inside the aside: text first).
 */
export const match = '.o-container__content > .row:has(> .o-container__sidebar)';
export const priority = 30;

export function encode(el, ctx) {
  const { $ } = ctx;
  const row = $(el);
  const side = row.children('.o-container__sidebar');
  const mains = row.children().not(side);
  if (side.length !== 1 || mains.length !== 1) return null;
  const mainHtml = ctx.walk(mains.get(0));
  const sideHtml = ctx.walk(side.get(0)).trim();
  const frag = $('<div></div>').append(sideHtml);
  const blocks = frag.children('div[class]').get().map((b) => $.html(b));
  frag.children('div[class]').remove();
  const cell = frag.html().trim();
  return `${mainHtml}${ctx.block('sidebar', [], [[cell]])}${blocks.join('')}`;
}
