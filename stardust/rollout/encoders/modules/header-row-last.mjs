/**
 * header-row-last — a section whose content ENDS with its `.row.o-container__header` (no row
 * after it): the header row keeps its 2.7429rem margin-bottom inside the band (source
 * `.o-container__header` mb; only its last CHILD loses the margin), so the band is 48px taller
 * than the default rhythm (continental-brand "The Future in Motion"; the image band holding only
 * an empty h2 header). Same section Style as header-row-end.mjs (`header-row-end`, CSS in
 * teaser.css: padding-bottom + 2.7429rem). Claims the `.o-container__content` (an all-empty
 * content would otherwise be skipped before its header row is visited). Priority 27.
 * (cluster-content)
 */
export const match = '.o-container__content';
export const priority = 27;

export function encode(el, ctx) {
  const { $ } = ctx;
  const last = $(el).children().last();
  if (!last.is('.row.o-container__header')) return null;
  const empty = !$(el).text().trim() && !$(el).find('img, picture, iframe, video, form').length;
  if (empty) return { html: '', sectionStyle: 'header-row-end' };
  return { html: ctx.walk(el), sectionStyle: 'header-row-end' };
}
