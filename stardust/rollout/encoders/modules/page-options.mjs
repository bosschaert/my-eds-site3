/**
 * page-options — TYPO3 `.c-pageoptions` (share icon + hidden share window + print link).
 * Block: page-options. One row, one cell: the share window heading (<h3>Share:</h3>) and a <ul>
 * of the share links (href + title verbatim, link text = the network label). The share / close /
 * print icons are block chrome (built by the block JS; print = window.print()).
 */
export const match = '.c-pageoptions';

export function encode(el, ctx) {
  const { $ } = ctx;
  const po = $(el);
  const heading = po.find('h1, h2, h3, h4, h5, h6').first();
  const items = po.find('a.c-sharelist__link').get().map((a) => {
    const link = $(a);
    const title = link.attr('title');
    const text = link.text().trim().replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const t = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
    return `<li><a href="${ctx.abs(link.attr('href')).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"${t}>${text}</a></li>`;
  });
  if (!items.length && !heading.length) return null;
  const cell = `${heading.length ? ctx.clean(heading) : ''}${items.length ? `<ul>${items.join('')}</ul>` : ''}`;
  return ctx.block('page-options', [], [[cell]]);
}
