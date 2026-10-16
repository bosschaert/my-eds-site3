/**
 * section-background — the o-container background image layer
 * (`.o-container__bg-image[style*=background-image]`, classes is-lucent / is-position-x-* /
 * is-position-y-*). Section Style `has-image` comes from the core GROUNDS.
 * Block: section-background, ONE cell: <img src="bg url" alt=""> (decorative band image).
 * Variants: `lucent` (opacity .3), `x-left|x-center|x-right`, `y-top|y-center|y-bottom`.
 * The block JS turns its wrapper into an absolute cover layer behind the section content.
 */
export const match = '.o-container__bg-image';
export const priority = 300;

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function encode(el, ctx) {
  const { $ } = ctx;
  const style = $(el).attr('style') || '';
  const url = (style.match(/background-image:\s*url\((["']?)([^"')]+)\1\)/i) || [])[2];
  if (!url) return '';
  const cls = ($(el).attr('class') || '').split(/\s+/);
  const variants = [];
  if (cls.includes('is-lucent')) variants.push('lucent');
  cls.forEach((c) => {
    const m = c.match(/^is-position-([xy])-(left|center|right|top|bottom)$/);
    if (m) variants.push(`${m[1]}-${m[2]}`);
  });
  return ctx.block('section-background', variants, [[`<img src="${attr(ctx.abs(url))}" alt="">`]]);
}
