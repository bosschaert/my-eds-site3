/**
 * teaser-beside — a `.row` of two columns, col-md-8 holding ONE module that walks to ONE block
 * (an image-layout teaser, the hotspots infographic) and col-md-4 holding ONE default teaser card
 * (hub siblings: ro-ro-cariera / es-mx-carrera / en-us-career "job portal" rows, the cs-cz map row).
 * teaser.mjs refuses the mixed row, so the two columns came out as stacked full-width blocks.
 * Priority 2. Output: the first column's block, then block teaser `single beside` with the card
 * row (teaser.mjs teaserRow); the teaser CSS lays the previous wrapper and the card 8/4 (>= 1023),
 * 6/6 (>= 767), stacked below. A section header CE ending with an empty media row (teaser.mjs
 * headerGap) → `header-gap` on both teaser blocks (+1.8286rem above the row, as teaser grids).
 */
import { teaserRow, headerGap } from './teaser.mjs';

export const match = '.row';
export const priority = 2;

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (cols.length !== 2) return null;
  const [a, b] = cols.map((c) => ($(c).attr('class') || '').split(/\s+/));
  if (!a.includes('col-md-8') || !b.includes('col-md-4')) return null;
  const card = $(cols[1]).find('.c-teaser');
  if (card.length !== 1 || /is-layout-(?!default)/.test(card.attr('class') || '')) return null;
  if ($(cols[0]).find('.c-teaser.is-layout-image, .c-hotspots-image').length !== 1) return null;
  const row = teaserRow(card.get(0), ctx);
  if (!row) return null;
  const first = ctx.walk(cols[0]).trim();
  const frag = $('<div></div>').append(first);
  const kids = frag.children().get();
  if (kids.length !== 1 || kids[0].tagName !== 'div' || !$(kids[0]).attr('class')) return null;
  const gap = headerGap(el, ctx);
  const lead = gap ? first.replace(/^<div class="teaser(?=[ "])/, '<div class="teaser header-gap') : first;
  const variants = gap ? ['single', 'beside', 'header-gap'] : ['single', 'beside'];
  return `${lead}${ctx.block('teaser', variants, [row])}`;
}
