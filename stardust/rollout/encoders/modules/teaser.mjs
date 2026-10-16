/**
 * teaser — TYPO3 c-teaser cards (`a.c-teaser` / `div.c-teaser`, is-layout-default).
 * Grid: a `.row` whose non-empty columns each hold one teaser CE → ONE block `teaser` with one
 * row per card; variant from the column classes: col-md-3 → cols-4, col-md-4 → cols-3,
 * col-sm-6 only → cols-2, col-md-8 + col-md-4 → wide-narrow. Empty columns are dropped (the
 * source gives them no mb-5, so they add no height). A lone teaser (row mixed with other CEs)
 * → a one-card block (variant from its column when present).
 * `header-gap` is added when the section header CE ends with an empty c-media__content.
 * Card row = [image cell, text cell]:
 *   image: <img> of the picture fallback rendition (alt verbatim; 16:9 crop, block-side cover)
 *   text:  <h3>c-teaser__header</h3> + c-teaser__text paragraphs +
 *          <p><a href title>c-teaser__link label</a></p> (card href / title verbatim).
 * Exported helper teaserRow(el, ctx) is reused by content-slider.mjs for teaser slides.
 * Not handled yet (→ null → UNMAPPED): is-layout-image teasers, coloured content (is-color-*).
 */
export const match = '.row, a.c-teaser, div.c-teaser';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// the section's header row (o-container__header) ends with an EMPTY c-media__content after the
// heading: the source keeps the header's 1.8286rem bottom margin on top of the row's 2.7429rem
// → variant `header-gap` on the block that follows (default content cannot carry it)
export function headerGap(el, ctx) {
  const { $ } = ctx;
  const row = $(el).closest('.o-container__content > .row');
  const header = row.prevAll('.o-container__header').first();
  if (!header.length) return false;
  const ce = header.find('.o-page__ce').last();
  const content = ce.children().last();
  return content.is('.row') && ce.children('.c-media__header').length > 0
    && !content.text().trim() && !content.find('img, picture, iframe, video').length;
}

export function teaserRow(el, ctx) {
  const { $ } = ctx;
  const t = $(el);
  const cls = (t.attr('class') || '').split(/\s+/);
  if (cls.some((c) => /^is-layout-(?!default$)./.test(c))) return null;
  const color = (t.find('.c-teaser__content').attr('class') || '').match(/is-color-(\S+)/);
  if (color) return null;
  const pic = t.find('.c-teaser__image picture, .c-teaser__image img').first();
  const img = pic.length ? ctx.img(pic) : '';
  const header = t.find('.c-teaser__header').first().text().trim();
  const text = t.find('.c-teaser__text').first();
  const paras = text.length ? ctx.cleanChildren(text).trim() : '';
  const label = t.find('.c-teaser__link').first().text().trim();
  const href = t.is('a') ? t.attr('href') : t.find('a[href]').first().attr('href');
  const title = t.attr('title') || t.find('a[href]').first().attr('title');
  let link = '';
  if (href) {
    const ti = title ? ` title="${attr(title)}"` : '';
    link = `<p><a href="${attr(ctx.abs(href))}"${ti}>${esc(label || title || header)}</a></p>`;
  }
  const body = `${header ? `<h3>${esc(header)}</h3>` : ''}${paras}${link}`;
  if (!img && !body) return null;
  return img ? [img, body] : [body];
}

function variantOf(colClass) {
  const c = colClass.split(/\s+/);
  if (c.includes('col-md-3')) return 'cols-4';
  if (c.includes('col-md-4')) return 'cols-3';
  if (c.includes('col-md-8')) return 'wide-narrow';
  if (c.includes('col-sm-6')) return 'cols-2';
  return '';
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  if (node.is('.c-teaser')) {
    const row = teaserRow(el, ctx);
    if (!row) return null;
    const col = node.closest('[class*="col-"]');
    const v = col.length ? variantOf(col.attr('class') || '') : '';
    return ctx.block('teaser', v ? [v] : [], [row]);
  }
  // grid row: every non-empty column = one teaser CE
  const cols = node.children().get().filter((c) => $(c).children().length);
  if (!cols.length) return null;
  const teasers = cols.map((c) => $(c).find('> .o-page__ce > .c-teaser'));
  if (teasers.some((t) => t.length !== 1)) return null;
  const rows = teasers.map((t) => teaserRow(t.get(0), ctx));
  if (rows.some((r) => !r)) return null;
  const classes = cols.map((c) => $(c).attr('class') || '');
  let v = variantOf(classes[0]);
  if (v === 'wide-narrow' || classes.some((c) => variantOf(c) !== v)) {
    v = classes.every((c, i) => variantOf(c) === (i % 2 ? 'cols-3' : 'wide-narrow')) ? 'wide-narrow' : '';
    if (!v) {
      ctx.warn(`teaser grid with mixed columns (${classes.join(' | ')}) — left to per-card blocks`);
      return null;
    }
  }
  const variants = v ? [v] : [];
  if (headerGap(el, ctx)) variants.push('header-gap');
  return ctx.block('teaser', variants, rows);
}
