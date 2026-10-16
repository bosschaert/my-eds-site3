/**
 * empty-ce-column — pre-pass (priority 90, always returns null): a grid `.row` column whose only
 * content is an EMPTY `.o-page__ce` (no text, no media — an unpublished / emptied CE left in the
 * TYPO3 grid) is removed before the row's modules run, so teaser / figure rows keep their one-
 * block shape (de-unternehmen-lieferanten: 3 teasers + 1 empty CE column → one teaser cols-3).
 * Columns with any text, media, iframe or form are untouched.
 */
export const match = '.row';
export const priority = 90;

export function encode(el, ctx) {
  const { $ } = ctx;
  $(el).children().each((i, c) => {
    const col = $(c);
    const kids = col.children();
    if (kids.length !== 1 || !kids.is('.o-page__ce')) return;
    if (col.text().trim() || col.find('img, picture, iframe, video, form, [data-ac-container]').length) return;
    col.remove();
  });
  return null;
}
