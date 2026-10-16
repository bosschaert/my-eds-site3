/**
 * teaser-row-text — a teaser grid `.row` whose LAST column(s) hold a text-only textmedia CE
 * instead of a teaser (de-unternehmen-lieferanten: 3 teasers + a column with "<p>.</p>").
 * teaser.mjs refuses the row (→ one block per card, stacked). Priority 9: the teaser columns →
 * ONE teaser block (variant from the column class as teaser.mjs: col-md-3 cols-4, col-md-4
 * cols-3, col-sm-6 cols-2), the trailing text columns → their content walked (default content,
 * kept verbatim after the grid — the source wraps that column onto the next grid line).
 */
import { teaserRow, headerGap } from './teaser.mjs';

export const match = '.row';
export const priority = 9;

function variantOf(cls) {
  if (/\bcol-md-3\b/.test(cls)) return 'cols-4';
  if (/\bcol-md-4\b/.test(cls)) return 'cols-3';
  if (/\bcol-sm-6\b/.test(cls) && !/\bcol-md-/.test(cls)) return 'cols-2';
  return '';
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  const isTeaser = (c) => $(c).find('> .o-page__ce > .c-teaser').length === 1;
  const n = cols.findIndex((c) => !isTeaser(c));
  if (n < 1 || cols.slice(n).some(isTeaser)) return null;
  const textOnly = (c) => {
    const ce = $(c).children('.o-page__ce');
    return ce.length === 1 && ce.find('.c-media__text').length
      && !ce.find('img, picture, iframe, video, form, .c-teaser').length;
  };
  if (!cols.slice(n).every(textOnly)) return null;
  const rows = cols.slice(0, n).map((c) => teaserRow($(c).find('> .o-page__ce > .c-teaser').get(0), ctx));
  if (rows.some((r) => !r)) return null;
  const v = variantOf($(cols[0]).attr('class') || '');
  if (!v || cols.slice(0, n).some((c) => variantOf($(c).attr('class') || '') !== v)) return null;
  const variants = [v, 'row-text'];
  if (headerGap(el, ctx)) variants.push('header-gap');
  // trailing column: paragraphs verbatim; a `<p>&nbsp;</p>` line keeps its box (the core drops it
  // as empty) as `<p>&#8203;</p>`, like spacer-paragraph.mjs. Variant row-text: teaser.css keeps
  // the column's mb-5 under that text.
  const trailing = cols.slice(n).map((c) => {
    const text = $(c).find('.c-media__text').first();
    const kids = text.children().get();
    if (!kids.length || !kids.every((k) => $(k).is('p'))) return ctx.walk(c);
    return kids.map((k) => {
      const t = $(k).text();
      if (!$(k).children().length && /^[\s\u00a0]+$/.test(t) && t.includes('\u00a0')) return '<p>&#8203;</p>';
      return ctx.clean(k);
    }).join('');
  }).join('');
  return ctx.block('teaser', variants, rows) + trailing;
}
