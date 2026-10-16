/**
 * time-bold — pre-pass, not a block (priority 100, always returns null). A teaser / news date
 * `<time class="d-inline-block font-weight-bold">` (press listings: "18. August 2026") renders
 * bold in the source; the delivery pipeline strips `<time>` (bold lost). The element is replaced
 * by `<strong>` holding its text verbatim (trimmed). (cluster-content)
 */
export const match = '.o-page__ce, .c-content-slider__slide';
export const priority = 100;

export function encode(el, ctx) {
  const { $ } = ctx;
  $(el).find('time.font-weight-bold').each((i, t) => {
    const txt = $(t).text().trim().replace(/&/g, '&amp;').replace(/</g, '&lt;');
    $(t).replaceWith(`<strong>${txt}</strong> `);
  });
  return null;
}
