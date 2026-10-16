/**
 * content-slider-media — `.c-content-slider` whose slides are TYPO3 textmedia CEs (en-pt / pt-pt
 * / sk-sk location and benefit sliders): content-slider.mjs walks them into a text-media block
 * NESTED in the slide cell (davids-model D2). Priority 11 (before content-slider.mjs); a slider
 * with any other slide shape → null (content-slider.mjs keeps it).
 * Block: content-slider (media [+ header-gap]). One row per slide, the text-media block's cells
 * un-nested, in render order:
 *   image above (text-media)        → [image cell, text cell]
 *   image below (text-media image-below) → [text cell, image cell]
 *   empty slide → a row of empty cells.
 * The block JS renders each row through the text-media block (image-below when the first cell
 * has no image).
 */
import { headerGap } from './teaser.mjs';

export const match = '.c-content-slider';
export const priority = 11;

export function encode(el, ctx) {
  const { $ } = ctx;
  const slides = $(el).find('.c-content-slider__slide').get();
  if (!slides.length) return null;
  const rows = [];
  for (const s of slides) {
    const html = ctx.walk(s).trim();
    if (!html) {
      rows.push(null);
    } else {
      const frag = $('<div></div>').append(html);
      const kids = frag.children().get();
      if (kids.length !== 1) return null;
      const block = $(kids[0]);
      const cls = (block.attr('class') || '').split(/\s+/);
      if (cls[0] !== 'text-media' || cls.some((c) => c && !['text-media', 'image-below'].includes(c))) return null;
      const cells = block.children().get().map((r) => $(r).children().first().html() || '');
      if (!cells.length || cells.length > 2) return null;
      const hasImg = (c) => /<img\b/.test(c);
      const img = cells.filter(hasImg);
      const txt = cells.filter((c) => !hasImg(c));
      rows.push(cls.includes('image-below') ? [...txt, ...img] : [...img, ...txt]);
    }
  }
  if (!rows.some(Boolean)) return null;
  const width = Math.max(1, ...rows.filter(Boolean).map((r) => r.length));
  rows.forEach((r, i) => { if (!r) rows[i] = Array(width).fill(''); });
  const variants = ['media'];
  if (headerGap(el, ctx)) variants.push('header-gap');
  return ctx.block('content-slider', variants, rows);
}
