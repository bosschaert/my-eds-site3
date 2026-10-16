/**
 * header-row-end — a section whose content ends with its `.o-container__header` row followed by
 * an EMPTY `.row` (contitech / reifen intro sections): the header row keeps its 2.7429rem
 * margin-bottom inside the band, so the band is 48px taller than the default rhythm. The header
 * row is walked as usual and the section gets Style `header-row-end` (CSS: padding-bottom
 * + 2.7429rem — hosted in teaser.css with the other section-rhythm rules). Priority 25.
 */
export const match = '.o-container__content > .row.o-container__header';
export const priority = 25;

export function encode(el, ctx) {
  const { $ } = ctx;
  const next = $(el).next();
  if (!next.length || !next.is('.row') || next.children().length || next.nextAll().length) return null;
  return { html: ctx.walk(el), sectionStyle: 'header-row-end' };
}
