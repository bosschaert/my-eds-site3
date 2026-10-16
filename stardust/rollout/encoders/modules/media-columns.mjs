/**
 * media-columns — a grid `.row` (has-columns container) whose 2+ non-empty columns each hold ONE
 * textmedia CE with an image gallery and/or header + text (or a single partial-width column:
 * col-sm-6 text beside nothing — the column keeps its width) (de-produkte-und-innovationen: "Reifen"
 * | "ContiTech", each heading + image + text). No other module claims it (figure.mjs needs an
 * image-ONLY column; teaser rows need c-teaser) → before: each CE became a full-width text-media
 * block, stacked. Priority 7. Block: media-columns (cols-2 | cols-3 | cols-4 from col-sm-6 /
 * col-md-4 / col-md-3). One row per column: [media cell (<p><img></p> + caption / creator <p>s),
 * text cell (header headings + c-media__text walked)] — media cell omitted for text-only CEs.
 * Columns holding video embeds, teasers or more than one CE → null. Variants wide-narrow /
 * narrow-wide: a col-md-8 | col-md-4 pair (cluster-content).
 */
export const match = '.row';
export const priority = 7;

function variantOf(cls) {
  if (/\bcol-md-3\b/.test(cls)) return 'cols-4';
  if (/\bcol-md-4\b/.test(cls)) return 'cols-3';
  if (/\bcol-sm-6\b/.test(cls) && !/\bcol-md-/.test(cls)) return 'cols-2';
  return '';
}

function l1Heads(l, $) {
  return $(l).children('.c-media__header').children('h1, h2, h3, h4, h5, h6').length;
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (!cols.length) return null;
  // two columns col-md-8 | col-md-4 (or 4 | 8), both col-sm-6 → wide-narrow / narrow-wide
  // (studien-publikationen whitepaper band: text | two stacked images) — cluster-content
  const cl = cols.map((c) => $(c).attr('class') || '');
  const pair = cols.length === 2 && cl.every((c) => /\bcol-sm-6\b/.test(c))
    && ((/\bcol-md-8\b/.test(cl[0]) && /\bcol-md-4\b/.test(cl[1]) && 'wide-narrow')
      || (/\bcol-md-4\b/.test(cl[0]) && /\bcol-md-8\b/.test(cl[1]) && 'narrow-wide'));
  const v = pair || variantOf(cl[0]);
  if (!v || (!pair && cl.some((c) => variantOf(c) !== v))) return null;
  const ces = cols.map((c) => $(c).children('.o-page__ce'));
  if (ces.some((l) => l.length !== 1)) return null;
  const ok = ces.every((l) => {
    const content = l.find('> .row > .col > .c-media__content.is-textpic');
    if (content.length !== 1 || l.find('.c-teaser, .c-quote, iframe, video, [data-ac-container], form').length) return false;
    if (content.find('.c-media__embed').not('.is-image').length) return false;
    const hasText = content.children('.c-media__text').text().trim() || l.children('.c-media__header').length;
    // image-only columns: only in rows figure.mjs does not claim (3+ columns or col-md-* grids)
    return hasText || (content.find('.c-media__gallery figure').length
      && (cols.length > 2 || /\bcol-md-/.test($(cols[0]).attr('class') || '')));
  });
  if (!ok) return null;
  $(el).find('a[class*="c-button"]').each((i, a) => {
    if (!$(a).parent().is('strong, b')) $(a).wrap('<strong></strong>');
  });
  const rows = ces.map((l) => {
    const figs = l.find('.c-media__gallery figure').get().map((f) => {
      const fig = $(f);
      const img = ctx.img(fig.find('picture, img').first());
      const link = fig.find('a[href]').filter((i, a) => $(a).find('picture, img').length).first();
      const pic = link.length ? `<a href="${ctx.abs(link.attr('href'))}">${img}</a>` : img;
      const cap = fig.find('figcaption').first();
      const capText = cap.clone().children('.c-image__creator').remove().end().text().trim();
      const creator = cap.find('.c-image__creator').text().trim();
      return `<p>${pic}</p>${capText ? `<p>${capText}</p>` : ''}${creator ? `<p>${creator}</p>` : ''}`;
    }).join('');
    const heads = l.children('.c-media__header').children('h1, h2, h3, h4, h5, h6').get()
      .map((h) => ctx.clean(h)).join('');
    const text = l.find('> .row > .col > .c-media__content > .c-media__text').get()
      .map((t) => ctx.walk(t)).join('');
    const row = [];
    if (figs) row.push(figs);
    if (heads + text) row.push(heads + text);
    return row;
  });
  // a column whose text walks to a block (table, …) cannot sit in a cell. Exception: the LAST
  // column is header-less, image-less and walks to exactly one block → that block follows the
  // media-columns block, variant `adopt-next` (media-columns.js moves it in as the last column).
  const isBlock = (c) => /<div class="/.test(c);
  const last = rows[rows.length - 1];
  const lone = last.length === 1 && rows.length > 1 && isBlock(last[0])
    && !l1Heads(ces[ces.length - 1], $) && !ces[ces.length - 1].find('.c-media__gallery figure').length
    ? last[0].replace(/(<p>(\s|&nbsp;|\u00a0)*<\/p>)+$/, '') : '';
  if (lone && /^<div class="[^"]+">[\s\S]*<\/div>$/.test(lone)
    && (lone.match(/<div class="/g) || []).length === 1
    && !rows.slice(0, -1).some((r) => r.some(isBlock))) {
    return ctx.block('media-columns', [v, 'adopt-next'], rows.slice(0, -1)) + lone;
  }
  if (rows.some((r) => r.some(isBlock))) return null;
  return ctx.block('media-columns', [v], rows);
}
