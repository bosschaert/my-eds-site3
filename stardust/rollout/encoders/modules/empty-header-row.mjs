/**
 * empty-header-row — an `.o-container__header` row whose CE is empty (no text, no media): the
 * source keeps the header row's 2.7429rem margin-bottom above the content row. Nothing is
 * encoded; the section gets Style `empty-header` (CSS: 2.7429rem above the band's first
 * wrapper — hosted in webform.css / media-columns.css, the blocks on those pages, until the
 * foundation request lands). Priority 26 (before header-row-end).
 */
export const match = '.o-container__content > .row.o-container__header';
export const priority = 26;

export function encode(el, ctx) {
  const { $ } = ctx;
  const row = $(el);
  if (row.text().trim() || row.find('img, picture, iframe, video, form, [data-ac-container]').length) return null;
  return { html: '', sectionStyle: 'empty-header' };
}
