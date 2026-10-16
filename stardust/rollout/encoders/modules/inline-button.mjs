/**
 * inline-button — a rich-text paragraph holding a `a.c-button*` BESIDE other text ("… befragt.
 * [Erfahren Sie mehr]", "… unsere [Produktsuche].", "E-Mail: [ir@conti.de]"). The foundation only
 * turns a paragraph-only `strong > a` into a button, so the inline one rendered as a plain link.
 * Emitted verbatim (link wrapped in <strong>, as button.mjs) + section Style `inline-buttons`
 * (breadcrumb.css: `p > strong > a` that is not a .button gets the .c-button box; icon from the
 * href: mailto → mail, other host → external, else none). Priority 4. (cluster-content)
 */
export const match = 'p';
export const priority = 4;

const norm = (s) => s.replace(/\s+/g, ' ').trim();

export function encode(el, ctx) {
  const { $ } = ctx;
  const p = $(el);
  const links = p.find('a[class*="c-button"]');
  if (!links.length || norm(p.text()) === norm(links.first().text())) return null;
  if (p.find('div, iframe, form, img').length) return null;
  links.each((i, a) => {
    if (!$(a).parent().is('strong, b')) $(a).wrap('<strong></strong>');
  });
  return { html: ctx.clean(el), sectionStyle: 'inline-buttons' };
}
