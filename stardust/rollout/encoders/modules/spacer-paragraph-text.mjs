/**
 * spacer-paragraph-text — a trailing `<p>&nbsp;</p>` spacer at the end of a text CE's rich text
 * (`.c-media__text > p:last-child`; hub press intro "Find what you're looking for fast:" quick
 * links: measured −60 px at 1440 on de-presse / en-press without it). The source renders it as one
 * empty line + paragraph margin; the core drops it (trim strips U+00A0) and the pipeline drops
 * `<p>&nbsp;</p>`, so it is emitted as `<p>&#8203;</p>` like spacer-paragraph.mjs. (cluster-hub)
 */
export const match = '.c-media__text > p:last-child';
export const priority = 50;

export function encode(el, ctx) {
  const { $ } = ctx;
  const p = $(el);
  if (p.children().length || !/^[ \s]+$/.test(p.text()) || !p.text().includes(' ')) return null;
  if (!p.prev('p').length) return null;
  return '<p>&#8203;</p>';
}
