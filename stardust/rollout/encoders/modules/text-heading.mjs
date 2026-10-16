/**
 * text-heading — richtext paragraph styled as a heading (`p.u-text-h1` … `p.u-text-h4`, the RTE's
 * "heading look" class) → the heading element of that level, content verbatim (strong kept).
 * The paragraph keeps p margins in the source (1.83rem above / below), tighter than the default
 * content heading rhythm (3.66rem above): the section gets Style `compact-headings`.
 * header-richtext (C-final, studien-publikationen): when the paragraph is the ONLY rich text of an
 * o-container__header CE that has a c-media__header heading, and the next row opens with a textpic
 * CE, the section also gets Style `header-richtext` (header margin 1.8286rem, no compact padding,
 * header-row gap 2.7429rem before the text-media — rules hosted in blocks/text-media/text-media.css).
 */
export const match = 'p.u-text-h1, p.u-text-h2, p.u-text-h3, p.u-text-h4';
export const priority = 5;

export function encode(el, ctx) {
  const { $ } = ctx;
  const level = ($(el).attr('class') || '').match(/u-text-h([1-4])/)[1];
  const inner = ctx.cleanChildren(el).trim();
  if (!inner) return null;
  const text = $(el).parent('.c-media__text');
  const ce = $(el).closest('.o-page__ce');
  const headerRow = ce.closest('.o-container__header');
  const headerRich = text.length && text.children().length === 1 && headerRow.length
    && ce.children('header.c-media__header').find('h1, h2, h3, h4').length
    && !ce.find('.c-media__gallery').length
    && headerRow.next().find('.o-page__ce').first().attr('data-ctype') === 'textmedia';
  return { html: `<h${level}>${inner}</h${level}>`, sectionStyle: headerRich ? 'compact-headings, header-richtext' : 'compact-headings' };
}
