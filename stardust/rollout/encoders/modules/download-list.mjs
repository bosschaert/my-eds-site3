/**
 * download-list — `.c-content-list` boxes whose rows are downloads (title + `a.c-content-list__
 * link--download` "Herunterladen / Download" + the secondary "PDF (2,7 MB)" meta; no calendar),
 * alone or side by side in one `.row` (investor presentations: two col-sm-6 lists).
 * Block: content-list (downloads [inner]); the second … list of a shared row gets
 * `beside half` (content-list.css lays the pair 50/50 >= 767). Rows:
 *   [<p>header</p>]                                         — c-content-list__header (if any)
 *   [<p>title</p>, <p><a href download>label <em>meta</em></a></p>] — per download (the anchor
 *                                                             text stays verbatim; <em> marks the
 *                                                             secondary-colour meta run)
 *   [<p><strong><a href>footer label</a></strong></p>]      — footer button(s)
 * Rows with a calendar, or a row mixing lists with other columns → null (content-list.mjs).
 */
export const match = '.row:has(> div > .o-page__ce > .c-content-list), .c-content-list';
export const priority = 11;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

function isDownloadList($, list) {
  const rows = list.find('.c-content-list__row');
  return rows.length > 0 && !list.find('.c-content-list__calendar').length
    && rows.get().every((r) => $(r).find('a.c-content-list__link--download').length === 1);
}

function listBlock($, list, ctx, extra) {
  const rows = [];
  const header = txt(list.find('.c-content-list__header').first());
  if (header) rows.push([`<p>${esc(header)}</p>`]);
  list.find('.c-content-list__row').each((i, r) => {
    const row = $(r);
    const title = txt(row.find('.c-content-list__title').first());
    const a = row.find('a.c-content-list__link--download').first();
    const meta = txt(a.find('.c-content-list__secondary-color').first());
    const label = txt(a.clone().find('.c-content-list__secondary-color, .u-icon').remove().end());
    const link = `<a href="${attr(ctx.abs(a.attr('href')))}">${esc(label)}${meta ? ` <em>${esc(meta)}</em>` : ''}</a>`;
    rows.push([`<p>${esc(title)}</p>`, `<p>${link}</p>`]);
  });
  list.find('.c-content-list__footer a[href]').each((i, a) => {
    rows.push([`<p><strong><a href="${attr(ctx.abs($(a).attr('href')))}">${esc(txt($(a)))}</a></strong></p>`]);
  });
  const variants = ['downloads'];
  if (list.closest('.container--inner').length) variants.push('inner');
  variants.push(...extra);
  return ctx.block('content-list', variants, rows);
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  if (node.is('.c-content-list')) {
    return isDownloadList($, node) ? listBlock($, node, ctx, []) : null;
  }
  const cols = node.children().get().filter((c) => $(c).children().length);
  const lists = cols.map((c) => $(c).find('> .o-page__ce > .c-content-list'));
  if (!lists.every((l) => l.length === 1 && isDownloadList($, l))) return null;
  return lists.map((l, i) => listBlock($, l, ctx, i ? ['beside', 'half'] : [])).join('');
}
