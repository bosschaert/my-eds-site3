/**
 * header-row — a CE in the section's header row (`.o-container__header .o-page__ce`) that encodes
 * as a `text-media` BLOCK (text-media.mjs: heading-light / eyebrow / gallery; media-header.mjs:
 * header-only CE with an eyebrow) gets the variant `header-row` when a content row follows it:
 * the source keeps o-container__header margin-bottom 2.7429rem (48px) before the row, where the
 * block's own CE rhythm would give 3.6571rem (+ 1.8286rem header margin for a header-only CE).
 * Delegates to media-header.mjs / text-media.mjs unchanged; default-content results → null
 * (the normal dispatch re-runs them; default content already has the 2.7429rem rule).
 * CORE NOTE: belongs in text-media.mjs; kept as a separate module (ADD-only rule).
 */
import * as mediaHeader from './media-header.mjs';
import * as textMedia from './text-media.mjs';

export const match = '.o-container__header .o-page__ce';
export const priority = 20;

export function encode(el, ctx) {
  const { $ } = ctx;
  const row = $(el).closest('.o-container__header');
  const next = row.nextAll('.row').filter((i, r) => $(r).text().trim()
    || $(r).find('img, picture, iframe, video, [data-ac-container]').length);
  if (!next.length) return null;
  for (const m of [mediaHeader, textMedia]) {
    if ($(el).is(m.match)) {
      const r = m.encode(el, ctx);
      const html = typeof r === 'string' ? r : r && r.html;
      if (html && /^<div class="text-media[ "]/.test(html)) {
        return html.replace(/^<div class="([^"]*)"/, '<div class="$1 header-row"');
      }
    }
  }
  return null;
}
