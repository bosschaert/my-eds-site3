/**
 * breadcrumb — TYPO3 `nav.c-breadcrumb` (ol of c-breadcrumb__item; spacers carry only icons).
 * Block: breadcrumb. One cell: <ul> with one <li> per step — <a href>label</a> for ancestors,
 * plain text for the current page. The section (o-container pb-0 d-sm-flex) needs no Style:
 * the block CSS restores its band padding and hides it below 767 like the source.
 */
export const match = 'nav.c-breadcrumb';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function encode(el, ctx) {
  const { $ } = ctx;
  const items = $(el).find('.c-breadcrumb__item').not('.is-spacer').get().map((li) => {
    const item = $(li);
    const a = item.find('a[href]').first();
    const text = esc(item.text().trim());
    if (!text) return '';
    if (a.length) {
      const href = ctx.abs(a.attr('href')).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `<li><a href="${href}">${text}</a></li>`;
    }
    return `<li>${text}</li>`;
  }).filter(Boolean);
  if (!items.length) return null;
  return ctx.block('breadcrumb', [], [[`<ul>${items.join('')}</ul>`]]);
}
