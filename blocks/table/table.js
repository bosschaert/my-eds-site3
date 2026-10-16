/*
 * table — source c-table (richtext table in a horizontal scroll shell, c-scroll-hint shadows).
 * Authoring: one block row per table row, one cell per column. Variants:
 *   striped — even rows grey (is-striped);
 *   head — first row is the table head (dark, has-dark-head).
 * Authors may add or omit cells: rows are padded to the widest row so columns stay aligned.
 */
function buildCell(tag, source) {
  const cell = document.createElement(tag);
  if (source) cell.append(...source.childNodes);
  return cell;
}

function updateShadows(scroller, shell) {
  const max = scroller.scrollWidth - scroller.clientWidth;
  shell.classList.toggle('is-left-scrollable', scroller.scrollLeft > 1);
  shell.classList.toggle('is-right-scrollable', max - scroller.scrollLeft > 1);
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  const width = Math.max(0, ...rows.map((row) => row.children.length));
  const hasHead = block.classList.contains('head') && rows.length > 1;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  rows.forEach((row, i) => {
    const isHead = hasHead && i === 0;
    const tr = document.createElement('tr');
    const cells = [...row.children];
    for (let c = 0; c < width; c += 1) {
      tr.append(buildCell(isHead ? 'th' : 'td', cells[c]));
    }
    if (isHead) {
      tr.querySelectorAll('th').forEach((th) => th.setAttribute('scope', 'col'));
      thead.append(tr);
    } else {
      tbody.append(tr);
    }
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const shell = document.createElement('div');
  shell.className = 'table-shell';
  const scroller = document.createElement('div');
  scroller.className = 'table-scroll';
  scroller.append(table);
  shell.append(scroller);
  block.replaceChildren(shell);
  block.classList.add('s-richtext');

  const update = () => updateShadows(scroller, shell);
  scroller.addEventListener('scroll', update, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(update).observe(scroller);
  update();
}
