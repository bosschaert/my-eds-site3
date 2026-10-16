/**
 * content-slider — TYPO3 `.c-content-slider` (Glide slider; arrows are chrome).
 * Block: content-slider. One row per `li.c-content-slider__slide`, in source order:
 *   teaser slide  → [image cell, text cell] exactly like a teaser card row (teaser.mjs);
 *   other slide   → [content cell]: the slide's CEs through the normal dispatch (headings,
 *                   rich text, nested modules);
 *   empty slide   → a row of empty cells (the source keeps empty slides as gaps in the track).
 * captureState: the first slide is active (block JS sets is-active on slide 1).
 */
import { teaserRow, headerGap } from './teaser.mjs';

export const match = '.c-content-slider';
export const priority = 10;

export function encode(el, ctx) {
  const { $ } = ctx;
  const slides = $(el).find('.c-content-slider__slide').get();
  if (!slides.length) return null;
  const rows = slides.map((s) => {
    const slide = $(s);
    const teasers = slide.find('.c-teaser');
    const ces = slide.find('> .o-page__ce');
    if (teasers.length === 1 && ces.length === 1 && ces.children().length === 1) {
      const row = teaserRow(teasers.get(0), ctx);
      if (row) return row;
    }
    const html = ctx.walk(s).trim();
    return html ? [html] : null;
  });
  // empty slides: as many empty cells as the widest row (keeps the table rectangular)
  const width = Math.max(1, ...rows.filter(Boolean).map((r) => r.length));
  rows.forEach((r, i) => { if (!r) rows[i] = Array(width).fill(''); });
  return ctx.block('content-slider', headerGap(el, ctx) ? ['header-gap'] : [], rows);
}
