/**
 * figure (coverage id `image`; the EDS name `image` is a davids-model D1 🔴 wrapper name) —
 * TYPO3 image-only c-media CE (`.c-media__content.is-textpic` with a gallery of image embeds,
 * no header, no text) inside an `o-container.has-columns` row.
 * Block: figure. ONE row, one cell per non-empty column, source order:
 *   image column → [<p><img></p> per figure (+ <a href> when linked) + caption / creator <p>s]
 *   other column → [the column's CEs through the normal dispatch] (text-media → headings +
 *                   rich text; c-button links come out as <strong><a> buttons via button.mjs)
 * Only 2-column col-sm-6 rows with exactly one image-only CE are claimed; anything else → null
 * (a lone image-only CE stays with text-media.mjs: block text-media, image above).
 */
export const match = '.has-columns .row';
export const priority = 5;

function imageOnly($, ce) {
  const c = $(ce);
  if (!c.is('.o-page__ce') || c.children('.c-media__header').length) return false;
  const content = c.find('> .row > .col > .c-media__content.is-textpic');
  if (content.length !== 1 || content.children('.c-media__text').length) return false;
  const embeds = content.find('.c-media__gallery .c-media__embed');
  return embeds.length > 0 && embeds.not('.is-image').length === 0;
}

function figureCell($, ce, ctx) {
  return $(ce).find('.c-media__embed.is-image figure').get().map((f) => {
    const fig = $(f);
    const img = ctx.img(fig.find('picture, img').first());
    const link = fig.find('a[href]').filter((i, a) => $(a).find('picture, img').length).first();
    const pic = link.length ? `<a href="${ctx.abs(link.attr('href'))}">${img}</a>` : img;
    const cap = fig.find('figcaption').first();
    const capText = cap.clone().children('.c-image__creator').remove().end().text()
      .trim();
    const creator = cap.find('.c-image__creator').text().trim();
    return `<p>${pic}</p>${capText ? `<p>${capText}</p>` : ''}${creator ? `<p>${creator}</p>` : ''}`;
  }).join('');
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (cols.length !== 2) return null;
  if (!cols.every((c) => /\bcol-sm-6\b/.test($(c).attr('class') || '')
    && !/\bcol-md-/.test($(c).attr('class') || ''))) return null;
  const ces = cols.map((c) => $(c).children('.o-page__ce').get());
  if (ces.some((list) => list.length !== 1)) return null;
  const flags = ces.map((list) => imageOnly($, list[0]));
  if (flags.filter(Boolean).length !== 1) return null;
  const cells = cols.map((c, i) => (flags[i] ? figureCell($, ces[i][0], ctx) : ctx.walk(c).trim()));
  return ctx.block('figure', [], [cells]);
}
