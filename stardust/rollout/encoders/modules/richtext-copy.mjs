/**
 * richtext-copy — a bare RTE text block (`.row > .col > div.s-richtext`, not a textmedia CE)
 * whose paragraphs are all `.u-text-copy` lead copy (+ button-only paragraphs), e.g. the supplier
 * pages' intro "<p class=u-text-copy><sup>Willkommen …</sup></p>". The core walked it to default
 * content (lead size lost: 1.5rem line box). Priority 6. Block: text-media (copy), one text row
 * (walked) — the same block/rhythm as text-media-copy.mjs (2.7429rem under the header row).
 */
export const match = '.col > div.s-richtext';
export const priority = 6;

export function encode(el, ctx) {
  const { $ } = ctx;
  const paras = $(el).children().get();
  const isCopy = (p) => $(p).is('p.u-text-copy');
  const isButton = (p) => $(p).is('p') && $(p).find('a').length === 1
    && /c-button/.test($(p).find('a').attr('class') || '')
    && $(p).text().trim() === $(p).find('a').text().trim();
  if (!paras.length || !paras.some(isCopy) || !paras.every((p) => isCopy(p) || isButton(p))) return null;
  $(el).find('a[class*="c-button"]').each((i, a) => {
    if (!$(a).parent().is('strong, b')) $(a).wrap('<strong></strong>');
  });
  // same CE as a header heading → in-header (c-media__header gap); inside the section header row
  // → header-row (2.7429rem row margin below instead of the CE rhythm) — cluster-content
  const ce = $(el).closest('.o-page__ce');
  const variants = ['copy'];
  if (ce.children('.c-media__header').length) variants.push('in-header');
  if (ce.closest('.row.o-container__header').length) variants.push('header-row');
  return ctx.block('text-media', variants, [[ctx.walk(el)]]);
}
