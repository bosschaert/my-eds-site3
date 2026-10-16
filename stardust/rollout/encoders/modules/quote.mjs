/**
 * quote — TYPO3 `.c-quote` (conmask_quote CE: portrait, quote text, author), alone or as one
 * column of a has-columns `.row` whose other column is an image-only textmedia CE.
 * Priority 8 (before figure.mjs, which would walk the quote column into its text cell).
 * Block: quote. One row per column, source order:
 *   figure column → [<p><img></p> (+ caption / creator <p>s)]
 *   quote column  → [<p><img portrait></p>? <blockquote><p>text</p></blockquote>
 *                    <p>author (verbatim inline markup: bold name, <br>, role)</p>]
 * Variants: `static` (is-static sizes), `alt-icon` (has-alternative-icon: „ above the text),
 * `image-left` (image container is-left; default right), `dark` (quote text black — every
 * ground but white: is-lightgray / is-gray / is-pastel-*), `yellow` (is-yellow: white text).
 * Other row shapes → null.
 */
export const match = '.row:has(> div > .o-page__ce > .c-quote), .c-quote';
export const priority = 8;

function figureCell($, col, ctx) {
  const ce = $(col).children('.o-page__ce');
  if (ce.length !== 1 || ce.find('.c-media__header, .c-media__text').text().trim()) return null;
  const figs = ce.find('.c-media__gallery figure').get();
  if (!figs.length || ce.find('.c-media__embed').not('.is-image').length) return null;
  return figs.map((f) => {
    const fig = $(f);
    const img = ctx.img(fig.find('picture, img').first());
    const cap = fig.find('figcaption').first();
    const capText = cap.clone().children('.c-image__creator').remove().end().text().trim();
    const creator = cap.find('.c-image__creator').text().trim();
    return `<p>${img}</p>${capText ? `<p>${capText}</p>` : ''}${creator ? `<p>${creator}</p>` : ''}`;
  }).join('');
}

function quoteCell($, q, ctx) {
  const pic = q.find('.c-quote__image').first();
  const img = pic.length ? `<p>${ctx.img(pic)}</p>` : '';
  const text = ctx.cleanChildren(q.find('.c-quote__text').get(0)).replace(/\s+/g, ' ').trim();
  const authorEl = q.find('.c-quote__author').first();
  let author = '';
  if (authorEl.length) {
    const a = authorEl.clone();
    a.find('.u-text-style__bold').each((i, b) => { $(b).replaceWith(`<strong>${$(b).html()}</strong>`); });
    author = ctx.cleanChildren(a.get(0)).replace(/\s+/g, ' ').trim();
  }
  return `${img}<blockquote><p>${text}</p></blockquote>${author ? `<p>${author}</p>` : ''}`;
}

function variants(q) {
  const cls = (q.attr('class') || '').split(/\s+/);
  const v = [];
  if (cls.includes('is-static')) v.push('static');
  if (q.find('.c-quote__text-container.has-alternative-icon').length) v.push('alt-icon');
  if (q.find('.c-quote__image-container.is-left').length) v.push('image-left');
  if (cls.includes('is-yellow')) v.push('yellow');
  else if (cls.some((c) => /^is-(lightgray|gray|pastel-)/.test(c))) v.push('dark');
  return v;
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  if (node.is('.c-quote')) return ctx.block('quote', variants(node), [[quoteCell($, node, ctx)]]);
  const cols = node.children().get().filter((c) => $(c).children().length);
  let q = null;
  const rows = [];
  for (const c of cols) {
    const quote = $(c).find('> .o-page__ce > .c-quote');
    if (quote.length) {
      q = quote.first();
      rows.push([quoteCell($, q, ctx)]);
    } else {
      const cell = figureCell($, c, ctx);
      if (!cell) return null;
      rows.push([cell]);
    }
  }
  if (!q) return null;
  return ctx.block('quote', variants(q), rows);
}
