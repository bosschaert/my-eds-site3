/**
 * figure-order — figure.mjs's has-columns row (text column | image column) where the source
 * reorders the columns below 767 (text `order-2 order-sm-0`, image `order-1 order-sm-0`: the image
 * stacks ABOVE the text on phones). Priority 6 (before figure.mjs): figure.mjs's output + variant
 * `image-first-mobile` (figure.css: the image column first below 767). Other rows → null.
 */
import { encode as figure } from './figure.mjs';

export const match = '.has-columns .row';
export const priority = 6;

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (cols.length !== 2) return null;
  const cls = cols.map((c) => ($(c).attr('class') || '').split(/\s+/));
  const pics = cols.map((c) => $(c).find('picture, img').length > 0);
  if (pics[0] || !pics[1]) return null;
  if (!cls[0].includes('order-2') || !cls[1].includes('order-1')) return null;
  const out = figure(el, ctx);
  const html = typeof out === 'string' ? out : out && out.html;
  if (!html || !/^<div class="figure[ "]/.test(html)) return null;
  return html.replace(/^<div class="figure([^"]*)"/, '<div class="figure$1 image-first-mobile"');
}
