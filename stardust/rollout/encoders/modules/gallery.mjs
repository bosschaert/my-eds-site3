/**
 * gallery — TYPO3 `conmask_gallery` CE (en-pt / pt-pt / sk-sk location galleries): a
 * `.row.mt-n4` of `col-12 col-sm-6 col-md-4 col-lg-3 mt-4` columns, each ONE figure.c-image
 * whose picture links to the full-size file (lightbox on the source).
 * Block: figure gallery. ONE row, one cell per figure (source order):
 *   [<p><a href=full title><img></a></p> + caption / creator <p>s when present] (the link title is
 *   the source anchor's title — its accessible name)
 * The figure block lays the cells out as a 1 / 2 / 3 / 4 column grid (variant gallery).
 * A gallery CE with a header or any non-figure column → null.
 */
export const match = '.o-page__ce[data-ctype="conmask_gallery"]';
export const priority = 10;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  if (ce.children().not('.row').length) return null;
  const cols = ce.find('> .row > div').get();
  if (!cols.length) return null;
  const cells = [];
  for (const c of cols) {
    const fig = $(c).children('figure.c-image');
    if (fig.length !== 1) return null;
    const img = ctx.img(fig.find('picture, img').first());
    const link = fig.find('a[href]').filter((i, a) => $(a).find('picture, img').length).first();
    const title = (link.attr('title') || '').trim();
    const ti = title ? ` title="${title.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"` : '';
    const pic = link.length ? `<a href="${ctx.abs(link.attr('href'))}"${ti}>${img}</a>` : img;
    const cap = fig.find('figcaption').first();
    const capText = cap.clone().children('.c-image__creator').remove().end().text()
      .replace(/\s+/g, ' ')
      .trim();
    const creator = cap.find('.c-image__creator').text().replace(/\s+/g, ' ').trim();
    cells.push(`<p>${pic}</p>${capText ? `<p>${capText}</p>` : ''}`
      + `${creator ? `<p>${creator}</p>` : ''}`);
  }
  return ctx.block('figure', ['gallery'], [cells]);
}
