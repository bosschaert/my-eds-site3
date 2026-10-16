/**
 * job-list — the source con-jobs latest-openings list (c-job-widget-list): one bordered row per
 * job (bold title, function and location with icons, orange chevron), then an optional centred
 * "all jobs" button. Captured snapshot of a server-side list (dynamic-features row 11).
 *
 * Content: one row per job — [<p><a href>title</a></p> (plain <p> when the job has no link),
 * <p>function</p>, <p>location</p>] — and optionally a last row holding only the list link.
 * Reconstructive decode: the authored title link becomes the row element, title / meta
 * paragraphs and the list link are MOVED (EW1); re-entrant (EW9).
 */
import { createIcon, uIcon } from '../../scripts/utils.js';

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

function metaItem(cell, icon) {
  const item = el('div', 'job-list-meta-item');
  const i = el('i', 'u-icon job-list-icon', createIcon(icon));
  const text = el('span', 'job-list-meta-text');
  const p = cell && cell.querySelector('p');
  if (p) text.append(...p.childNodes);
  item.append(i, text);
  return item;
}

export default function decorate(block) {
  if (block.querySelector('.job-list-items')) return;
  const rows = [...block.children];
  const items = el('div', 'job-list-items');
  const footer = el('div', 'job-list-more');
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      cells[0].querySelectorAll('a[href]').forEach((a) => {
        const p = a.closest('p') || el('p', '', a);
        p.className = 'button-wrapper';
        // source a.c-button: chevron icon whatever the href (absolute until localized)
        a.className = 'c-button is-internal';
        footer.append(p);
      });
      row.remove();
      return;
    }
    const [titleCell, fnCell, locCell] = cells;
    const link = titleCell.querySelector('a[href]');
    const title = el('div', 'job-list-title');
    let item;
    if (link) {
      title.append(...link.childNodes);
      item = link;
      item.className = 'job-list-item';
    } else {
      const p = titleCell.querySelector('p');
      title.append(...(p || titleCell).childNodes);
      item = el('div', 'job-list-item');
    }
    const meta = el(
      'div',
      'job-list-meta',
      metaItem(fnCell, 'function'),
      metaItem(locCell, 'marker'),
    );
    const body = el('div', 'job-list-body', title, meta);
    const chevron = el('div', 'job-list-chevron', uIcon('chevron-right', 'has-bg'));
    item.append(body, chevron);
    items.append(item);
    row.remove();
  });
  block.append(items);
  if (footer.children.length) block.append(footer);
}
