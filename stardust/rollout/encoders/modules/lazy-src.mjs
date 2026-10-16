/**
 * lazy-src — not a block: a one-time pre-pass (priority 1000, always null). Lazy images the
 * capture never scrolled to still carry the lazyload placeholder in `src` (a blurred low-res
 * rendition, e.g. csm_…_df535887eb.png) and the real fallback rendition in `data-src`; loaded
 * ones have src === data-src. Every `img[data-src]` of the page gets src = data-src (and every
 * `source[data-srcset]` without srcset gets srcset) before any module reads an image.
 * CORE NOTE: belongs in encode.mjs ctx.img() / pictureImgs() (prefer data-src).
 */
export const match = '*';
export const priority = 1000;

const done = new WeakSet();

export function encode(el, ctx) {
  const { $ } = ctx;
  const root = $.root().get(0);
  if (done.has(root)) return null;
  done.add(root);
  $('img[data-src]').each((i, img) => {
    const n = $(img);
    if (n.attr('data-src')) n.attr('src', n.attr('data-src'));
  });
  $('source[data-srcset]').each((i, s) => {
    const n = $(s);
    if (!n.attr('srcset')) n.attr('srcset', n.attr('data-srcset'));
  });
  return null;
}
