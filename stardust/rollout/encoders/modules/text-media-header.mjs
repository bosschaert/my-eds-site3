/**
 * text-media-header — a textpic CE with images whose `c-media__header` heading(s) are followed by
 * rich text that itself OPENS with a heading (en-company / de-unternehmen "Structure" + h4 "Tires
 * and ContiTech: …"): text-media.js moves every leading heading into the header, so the h4 left
 * the text column (above the image instead of beside / below it). Priority 1 (with
 * text-media-unnest.mjs, before text-media.mjs): text-media.mjs output + variant `header-N`
 * (N = header headings) — the block keeps only those N headings in the header. (cluster-hub)
 */
import * as textMedia from './text-media.mjs';

export const match = textMedia.match;
export const priority = 1;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const n = ce.children('.c-media__header').find('h1, h2, h3, h4, h5, h6').length;
  if (!n || n > 9) return null;
  const text = ce.find('> .row > .col > .c-media__content > .c-media__text').first();
  const first = text.children().first();
  const isHead = first.length && (/^h[1-6]$/.test(first.get(0).tagName)
    || first.is('p.u-text-h1, p.u-text-h2, p.u-text-h3, p.u-text-h4'));
  if (!isHead) return null;
  if (ce.find('.c-media__text table, .c-media__text .c-table__wrapper').length) return null;
  const out = textMedia.encode(el, ctx);
  const html = out && typeof out === 'object' ? out.html : out;
  if (!html || !/^\s*<div class="text-media/.test(html)) return null;
  const fixed = html.replace(/^(\s*<div class="text-media)(?=[ "])/, `$1 header-${n}`);
  return out && typeof out === 'object' ? { ...out, html: fixed } : fixed;
}
