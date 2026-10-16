/**
 * content-list — TYPO3 `.c-content-list` (event teaser box: header, calendar rows with
 * "add to calendar" links, footer button).
 * Block: content-list. Rows:
 *   [<p>c-content-list__header</p>]                       — header (one cell, no link)
 *   [<p>day</p><p>month</p>, <p>title</p><p>date</p><p><a href>link label</a></p>] — per event
 *   [<p><strong><a href>footer label</a></strong></p>]     — footer (one cell, a link)
 * Variant `inner` when the list sits in a `.container--inner` (gray box, compact type).
 * Row composition: when the list shares its `.row` with other columns (source col-md-8 teaser |
 * col-md-4 list), this module claims the row: the other columns are walked (their blocks are
 * emitted first, source order) and the list gets variant `beside` — its block CSS lays the
 * previous block wrapper and the list side by side (50/50 >= 767, 8/4 >= 1023, list stretched).
 */
export const match = '.row:has(> div > .o-page__ce > .c-content-list), .c-content-list';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

function listBlock($, el, ctx, extra) {
  const list = $(el);
  const rows = [];
  const header = txt(list.find('.c-content-list__header').first());
  if (header) rows.push([`<p>${esc(header)}</p>`]);
  list.find('.c-content-list__row').each((i, r) => {
    const row = $(r);
    const day = txt(row.find('.c-content-list__calendar-day').first());
    const month = txt(row.find('.c-content-list__calendar-month').first());
    const cal = `${day ? `<p>${esc(day)}</p>` : ''}${month ? `<p>${esc(month)}</p>` : ''}`;
    const title = txt(row.find('.c-content-list__title').first());
    const date = txt(row.find('.c-content-list__date').first());
    const a = row.find('a[href]').first();
    const link = a.length ? `<p><a href="${attr(ctx.abs(a.attr('href')))}">${esc(txt(a))}</a></p>` : '';
    rows.push([cal, `${title ? `<p>${esc(title)}</p>` : ''}${date ? `<p>${esc(date)}</p>` : ''}${link}`]);
  });
  list.find('.c-content-list__footer a[href]').each((i, a) => {
    rows.push([`<p><strong><a href="${attr(ctx.abs($(a).attr('href')))}">${esc(txt($(a)))}</a></strong></p>`]);
  });
  const variants = [];
  if (list.closest('.container--inner').length) variants.push('inner');
  variants.push(...extra);
  return ctx.block('content-list', variants, rows);
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  if (node.is('.c-content-list')) return listBlock($, el, ctx, []);
  const cols = node.children().get().filter((c) => $(c).children().length);
  const out = [];
  let others = 0;
  cols.forEach((c) => {
    const list = $(c).find('> .o-page__ce > .c-content-list');
    if (list.length) {
      out.push(listBlock($, list.get(0), ctx, others ? ['beside'] : []));
    } else {
      out.push(ctx.walk(c));
      others += 1;
    }
  });
  return out.join('');
}
