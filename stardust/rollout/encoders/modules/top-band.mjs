/**
 * top-band — the page's FIRST band is a content o-container (no hero, no breadcrumb band before
 * it: sustainability contact form). The source keeps the o-container's 2.7429rem top padding;
 * the foundation's `main > .section:first-child.is-white { padding-top: 0 }` (meant for bands
 * under a hero) removed it. Claims that container's `.o-container__content`, walks it, adds
 * section Style `top-band` (webform.css restores the padding). Priority 28. (cluster-content)
 */
export const match = '.o-container__content';
export const priority = 28;

export function encode(el, ctx) {
  const { $ } = ctx;
  const band = $(el).parent('.o-container');
  if (!band.length || !band.parent().is('main')) return null;
  const before = band.prevAll().get().filter((b) => $(b).text().trim() || $(b).find('img').length);
  if (before.length || band.find('nav.c-breadcrumb').length) return null;
  return { html: ctx.walk(el), sectionStyle: 'top-band' };
}
