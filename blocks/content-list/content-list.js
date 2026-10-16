/**
 * content-list — the source c-content-list (event box: header, calendar rows with an
 * "add to calendar" link, footer button).
 *
 * Content (rows):
 *   one cell, no link            → header
 *   two cells                    → event: [calendar: <p>day</p><p>month</p>,
 *                                   <p>title</p><p>date</p><p><a href>link label</a></p>]
 *   one cell with a link         → footer button
 * Variants: inner (gray box, compact type — source .container--inner), beside (sits next to
 *   the previous block: 50/50 >= 767, 8/4 columns >= 1023, box stretched to the row height).
 *   downloads (rows [title, <a>label <em>meta</em></a>]: download icon, meta in slate),
 *   half (with beside: the pair stays 50/50 >= 1023 — two col-sm-6 lists).
 * The whole event row is clickable through its link (::before overlay, source behaviour).
 * Reconstructive decode: authored text / links are MOVED (EW1); re-entrant (EW9).
 */
async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '', tag = 'i') => {
      const box = document.createElement(tag);
      box.className = `u-icon ${classes}`.trim();
      const span = document.createElement('span');
      span.className = `icon icon-${name}`;
      box.append(span);
      return box;
    };
  }
}

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

// a single-paragraph cell arrives unwrapped (text directly in the cell) → the cell itself
const paras = (cell) => {
  const list = [...cell.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter((p) => p.textContent.trim());
  return list.length || !cell.textContent.trim() ? list : [cell];
};

function buildEvent(calCell, textCell, uIcon) {
  const row = el('div', 'content-list-row');
  const [day, month] = paras(calCell);
  const cal = el('div', 'content-list-calendar');
  if (day) cal.append(el('div', 'content-list-calendar-day', ...day.childNodes));
  if (month) cal.append(el('div', 'content-list-calendar-month', ...month.childNodes));
  row.append(el('div', '', cal));

  const body = el('div', 'content-list-body');
  const link = textCell.querySelector('a[href]');
  const texts = paras(textCell).filter((p) => !link || !p.contains(link));
  if (texts[0]) body.append(el('div', 'content-list-title', ...texts[0].childNodes));
  if (texts[1]) {
    const date = el('span', 'content-list-date-text', ...texts[1].childNodes);
    body.append(el('div', 'content-list-date mt-1', date));
  }
  if (link) {
    const label = el('span', '', ...link.childNodes);
    link.className = 'content-list-link mt-2';
    link.replaceChildren(uIcon('calendar', 'is-sm has-bg mr-1'), label);
    body.append(link);
  }
  row.append(body);
  return row;
}

// downloads variant (cluster-content download-list.mjs): [title, <a href>label <em>meta</em></a>]
function buildDownload(titleCell, linkCell, uIcon) {
  const row = el('div', 'content-list-row');
  const body = el('div', 'content-list-body');
  const [title] = paras(titleCell);
  if (title) body.append(el('div', 'content-list-title', ...title.childNodes));
  const link = linkCell.querySelector('a[href]');
  if (link) {
    const meta = link.querySelector('em');
    const label = el('span', 'mr-1');
    const text = el('div', 'content-list-link-text', label);
    [...link.childNodes].forEach((n) => {
      if (n !== meta) label.append(n);
    });
    if (meta) {
      const span = el('span', 'content-list-secondary', ...meta.childNodes);
      meta.remove();
      text.append(span);
    }
    link.className = 'content-list-link is-download mt-1';
    link.setAttribute('download', '');
    link.replaceChildren(uIcon('download-single', 'is-sm has-bg mr-1'), text);
    body.append(el('div', '', link));
  }
  row.append(body);
  return row;
}

export default async function decorate(block) {
  if (block.querySelector('.content-list-content')) return;
  const uIcon = await iconFactory();
  const header = el('div', 'content-list-header');
  const content = el('div', 'content-list-content');
  const footer = el('div', 'content-list-footer mt-3');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    row.remove();
    if (!row.textContent.trim()) return;
    if (cells.length >= 2 && block.classList.contains('downloads')) {
      content.append(buildDownload(cells[0], cells[1], uIcon));
      return;
    }
    if (cells.length >= 2) {
      content.append(buildEvent(cells[0], cells[1], uIcon));
      return;
    }
    const link = row.querySelector('a[href]');
    if (link) {
      link.className = 'content-list-button c-button is-internal';
      footer.append(link);
      return;
    }
    const p = paras(cells[0])[0];
    if (p && !header.childNodes.length) header.append(...p.childNodes);
  });
  if (header.childNodes.length) block.append(header);
  block.append(content);
  if (footer.children.length) block.append(footer);
}
