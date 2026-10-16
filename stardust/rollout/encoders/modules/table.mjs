/**
 * table — TYPO3 richtext table `.c-table__wrapper` (scroll-hint shell) or a bare `table.c-table`
 * → block `table`. One block row per <tr>, one cell per <td>/<th>; cell content cleaned verbatim
 * (cleanChildren keeps p / ul / strong / a). colspan/rowspan are not representable in a DA block
 * table and are dropped with a warning. The scroll-hint icon ("scrollable") is chrome → not encoded.
 * Variants: striped (is-striped); head (a <thead> row → first block row renders as thead, styled
 * dark when has-dark-head). Authored RTE cell formatting (inline style on most cells) → variants:
 * highlight-head (first row all #ffc000), centered (text-align:center), bordered (solid borders),
 * top (vertical-align:top), compact (padding 0cm 5.4pt), highlight-orange (every cell #fe9a2e;
 * cluster-content). Captions: none on current pages (warned).
 */
export const match = '.c-table__wrapper, .c-table__container, table.c-table';
export const priority = 5;

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  const table = node.is('table') ? node : node.find('table.c-table, table').first();
  if (!table.length) return null;
  const cls = (table.attr('class') || '').split(/\s+/);
  const variants = [];
  if (cls.includes('is-striped')) variants.push('striped');
  const cells = table.find('td, th').get().map((c) => ($(c).attr('style') || '').toLowerCase());
  const most = (re) => cells.length && cells.filter((st) => re.test(st)).length * 2 >= cells.length;
  const firstRow = table.find('tr').first().children('td, th').get()
    .map((c) => ($(c).attr('style') || '').toLowerCase());
  if (firstRow.length && firstRow.every((st) => /background-color:\s*#ffc000/.test(st))) {
    variants.push('highlight-head');
  }
  if (cells.length && cells.every((st) => /background-color:\s*#fe9a2e/.test(st))) {
    variants.push('highlight-orange');
  }
  if (most(/text-align:\s*center/)) variants.push('centered');
  if (most(/border[a-z-]*:[^;]*solid/)) variants.push('bordered');
  if (most(/vertical-align:\s*top/)) variants.push('top');
  if (most(/padding:\s*0(cm|px)?\s+[\d.]+pt/)) variants.push('compact');
  const thead = table.children('thead');
  if (thead.length) variants.push('head');
  if (table.find('caption').length) ctx.warn('table caption not encoded');
  const rows = table.find('tr').get().map((tr) => $(tr).children('td, th').get().map((c) => {
    if ($(c).attr('colspan') || $(c).attr('rowspan')) ctx.warn('table colspan/rowspan dropped');
    return ctx.cleanChildren(c).trim();
  }));
  return ctx.block('table', variants, rows);
}
