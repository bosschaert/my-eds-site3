/**
 * country-selector — TYPO3 `.col` holding `.c-country-selector` (region h2 + ul of countries),
 * optionally followed by more `h2.c-country-selector__title` regions with richtext (the
 * "Other Continental Websites" links). Emits the column's header headings as default content,
 * then block `country-selector`:
 *   [<h2>region</h2>]                        one-cell row = region title
 *   [<p>:icon: Country</p> | <p>links</p>]   two-cell row = country: icon token (flag-4x3-xx /
 *                                            globe, from the source icon class) + name, then the
 *                                            language links with their " | " separators verbatim
 *   [richtext]                               one-cell row without heading = free region content
 */
export const match = '.col:has(> .c-country-selector)';
export const priority = 10;

export function encode(el, ctx) {
  const { $ } = ctx;
  const col = $(el);
  const out = [];
  const rows = [];
  const country = (li) => {
    const item = $(li);
    const name = item.find('.c-country-selector__country-name').first();
    const iconCls = (name.find('[class*="icon-con-"]').attr('class') || '').match(/icon-con-([a-z0-9-]+)/);
    const icon = iconCls ? `:${iconCls[1]}: ` : '';
    const label = name.children('span').last().text().replace(/\s+/g, ' ').trim();
    const langs = ctx.cleanChildren(item.find('.c-country-selector__languages').first())
      .replace(/\s+/g, ' ').trim();
    rows.push([`<p>${icon}${label}</p>`, `<p>${langs}</p>`]);
  };
  const region = (node) => {
    $(node).children().each((i, c) => {
      if ($(c).is('h1, h2, h3, h4, h5, h6')) rows.push([ctx.clean(c)]);
      else if ($(c).is('ul')) $(c).children('li').each((j, li) => country(li));
      else if ($(c).text().trim()) rows.push([ctx.cleanChildren(c).trim()]);
    });
  };
  let inBlock = false;
  col.children().each((i, c) => {
    const node = $(c);
    if (node.is('.c-country-selector')) {
      inBlock = true;
      region(c);
    } else if (inBlock && node.is('h1, h2, h3, h4, h5, h6')) {
      rows.push([ctx.clean(c)]);
    } else if (inBlock && node.text().trim()) {
      rows.push([node.is('p, ul, ol') ? ctx.clean(c) : ctx.cleanChildren(c).trim()]);
    } else if (!inBlock) {
      out.push(node.is('p, ul, ol, h1, h2, h3, h4, h5, h6') ? ctx.clean(c) : ctx.walk(c));
    }
  });
  out.push(ctx.block('country-selector', [], rows));
  return out.join('');
}
