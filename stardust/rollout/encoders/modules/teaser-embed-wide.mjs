/**
 * teaser-embed-wide — teaser-embed.mjs for the col-md-8 teaser + col-md-4 widget row (home:
 * annual-report teaser beside the EquityStory share-price chart). teaser-embed.mjs derives the
 * grid from the first column only (col-md-8 → cols-2, 50/50); this shape is the teaser block's
 * `wide-narrow` grid (8/4 >= 1023). Delegates the rows to teaser-embed.mjs unchanged.
 * CORE NOTE: belongs in teaser-embed.mjs variantOf(); kept as a separate module (ADD-only rule).
 */
import { encode as encodeEmbed, match as embedMatch } from './teaser-embed.mjs';

export const match = embedMatch;
export const priority = 11;

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  const cls = cols.map((c) => ($(c).attr('class') || '').split(/\s+/));
  const wideNarrow = cols.length === 2 && cls[0].includes('col-md-8') && cls[1].includes('col-md-4');
  if (!wideNarrow) return null;
  const html = encodeEmbed(el, ctx);
  if (!html) return null;
  return html.replace(/^<div class="teaser [^"]*">/, '<div class="teaser wide-narrow with-embed">');
}
