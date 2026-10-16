/**
 * figure-meta — figure.mjs's has-columns row (image-only CE | text CE) where the text CE's
 * header carries a `.c-media__meta` eyebrow ("2025" above "Nachhaltigkeitsbericht"). figure.mjs
 * walks the text column, which text-media.mjs turns into a NESTED text-media block (eyebrow
 * path) — invalid in a cell. Priority 6 (before figure.mjs): the same figure block, the text
 * cell written directly as <p>eyebrow</p> + header heading(s) + the c-media__text children
 * (walked), and variant `meta` (figure.js lifts the leading eyebrow paragraph into
 * `.figure-text-meta`: uppercase, weight 400, no margin — source .c-media__meta).
 */
import { encode as figure } from './figure.mjs';

export const match = '.has-columns .row';
export const priority = 6;

export function encode(el, ctx) {
  const { $ } = ctx;
  const metaCe = $(el).find('> div > .o-page__ce:has(> .c-media__header > .c-media__meta)');
  if (metaCe.length !== 1) return null;
  // button.mjs pre-pass (runs per dispatched CE; this module claims the row first)
  $(el).find('a[class*="c-button"]').each((i, a) => {
    if (!$(a).parent().is('strong, b')) $(a).wrap('<strong></strong>');
  });
  const walk = (col) => {
    const ce = $(col).children('.o-page__ce').first();
    const header = ce.children('.c-media__header').first();
    if (!header.children('.c-media__meta').length) return ctx.walk(col);
    if (ce.find('.c-media__gallery').length) return null;
    const head = header.children().get().map((h) => ($(h).is('.c-media__meta')
      ? `<p>${$(h).text().replace(/\s+/g, ' ').trim().replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`
      : ctx.clean(h))).join('');
    const text = ce.find('> .row > .col > .c-media__content > .c-media__text').get()
      .map((t) => ctx.walk(t)).join('');
    return head + text;
  };
  let bad = false;
  const out = figure(el, {
    ...ctx,
    walk: (c) => {
      const r = walk(c);
      if (r === null) bad = true;
      return r || '';
    },
  });
  if (!out || bad) return null;
  const html = typeof out === 'string' ? out : out.html;
  if (/<div class="(?!figure)[a-z]/.test(html.replace(/^<div class="figure[^"]*">/, ''))) return null;
  return html.replace(/^<div class="figure([^"]*)"/, '<div class="figure$1 meta"');
}
