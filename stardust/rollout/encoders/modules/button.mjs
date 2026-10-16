/**
 * button — not a block: a pre-pass on every content element. TYPO3 button links
 * (`a.c-button`, `a.c-button--internal|external|download|mail`) are wrapped in <strong> in the
 * capture DOM, so the core's default-content cleaner keeps them as EDS buttons
 * (<p><strong><a></a></strong></p> → a.button). Always returns null (never claims the element).
 * CORE NOTE: this belongs in encode.mjs cleanNode(); kept as a module so the core stays untouched.
 */
export const match = '.o-page__ce, .c-content-slider__slide';
export const priority = 100;

export function encode(el, ctx) {
  const { $ } = ctx;
  $(el).find('a[class*="c-button"]').each((i, a) => {
    const link = $(a);
    if (link.parent().is('strong, b')) return;
    link.wrap('<strong></strong>');
  });
  return null;
}
