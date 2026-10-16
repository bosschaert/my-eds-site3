/**
 * heading-gap — header-only textmedia CE (`.c-media__header` with ONE heading + an EMPTY
 * `.row > .col` media row) that is FOLLOWED by another CE opening with a header heading
 * (de-investoren-veranstaltungen: h1 "Veranstaltungen" + empty row, then CE h2 "Ergebnisse …").
 * The source keeps the header's 1.8286rem margin before the empty row, so the next heading sits
 * 32px lower than the default-content rhythm puts it. Emitted as the heading (default content)
 * + section Style `heading-gap` (CSS: `.section.heading-gap` adds 1.8286rem above the heading
 * that follows an h1 / h2 in default content — hosted in breadcrumb.css until the foundation
 * request lands). Other shapes → null (text-media.mjs / teaser header-gap handle them).
 */
export const match = '.o-page__ce';
export const priority = 7;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const kids = ce.children().get();
  if (kids.length !== 2) return null;
  const [header, row] = kids.map((k) => $(k));
  if (!header.is('.c-media__header') || !row.is('.row')) return null;
  if (row.text().trim() || row.find('img, picture, iframe, video, form').length) return null;
  const heads = header.children('h1, h2, h3');
  if (heads.length !== 1 || header.children().length !== 1) return null;
  const next = ce.nextAll('.o-page__ce').first();
  if (!next.length || !next.children('.c-media__header').first().children('h2, h3, h4').length) {
    return null;
  }
  return { html: ctx.clean(heads.get(0)), sectionStyle: 'heading-gap' };
}
