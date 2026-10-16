/**
 * search — the source Solr search / listing widget (c-search: search box, filter tabs + options,
 * result count + sort, result items, pagination, active filter tags). Dynamic-features row 2
 * (solr-listings, static-snapshot interim): the captured first page is authored content; the
 * search box submits to this page with ?q= (no index yet), tabs switch nothing but the active
 * state, options / paging are shown as captured.
 *
 * Content: rows whose LAST cell names the kind (search | filters | options | count | result |
 * pagination | tag); the other cells are the authored content (see the encoder notes).
 * @ew-exempt the kind cell is layout configuration, not displayed text.
 * Decoration (reconstructive): authored nodes are MOVED into the slots (EW1). Re-entrant (EW9).
 *
 * Variant `index` (dynamics row 1, header search results — patterns.md § search-index-backed):
 * the header quick-search form submits here with ?q= (the source's tx_solr[q] is accepted too);
 * results come from /query-index.json scoped to this page's locale tree. Rows: `search`
 * (placeholder), `count` (first <p> = "{n} …" result-count template, second <p> = no-results copy).
 * Ranking: title matches first, then description, then body text; deduped by title + description;
 * 10 per page. Titles drop the " - Continental AG" / " | Continental" suffixes the source omits.
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '') => el('i', `u-icon ${classes}`.trim());
  }
}

const kids = (cell) => (cell ? [...cell.childNodes] : []);

const PAGE_SIZE = 10;

export function cleanTitle(title) {
  let t = String(title || '').trim();
  let prev;
  do {
    prev = t;
    t = t.replace(/\s+(?:-|\|)\s+Continental(?: AG)?$/i, '').trim();
  } while (t !== prev);
  return t;
}

export function rankIndex(rows, q, prefix = '/') {
  const terms = String(q || '').toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const scoped = rows.filter((r) => (r.path || '').startsWith(prefix)
    && !/noindex/i.test(r.robots || ''));
  const hasAll = (v) => terms.every((t) => String(v || '').toLowerCase().includes(t));
  const title = scoped.filter((r) => hasAll(cleanTitle(r.title)));
  const desc = scoped.filter((r) => !title.includes(r) && hasAll(r.description));
  const text = scoped.filter((r) => !title.includes(r) && !desc.includes(r) && hasAll(r.text));
  const seen = new Set();
  return [...title, ...desc, ...text].filter((r) => {
    const k = `${cleanTitle(r.title)}|${r.description || ''}`.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function loadIndex() {
  const rows = [];
  try {
    for (let off = 0; off < 5000; off += 500) {
      // eslint-disable-next-line no-await-in-loop
      const r = await fetch(`/query-index.json?offset=${off}&limit=500`);
      if (!r.ok) break;
      // eslint-disable-next-line no-await-in-loop
      const j = await r.json();
      rows.push(...(j.data || []));
      if (off + 500 >= (j.total || 0)) break;
    }
  } catch (e) { /* index unavailable: no results */ }
  return rows;
}

function excerpt(row, terms) {
  const src = String(row.description || row.text || '').replace(/\s+/g, ' ').trim();
  const low = src.toLowerCase();
  const at = terms.map((t) => low.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (at === undefined || at < 120) return src.slice(0, 240) + (src.length > 240 ? ' …' : '');
  return `… ${src.slice(at - 60, at + 180)} …`;
}

async function decorateIndex(block, uIcon) {
  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || params.get('tx_solr[q]') || '').trim();
  const pageNo = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);
  let placeholder = '';
  let countTpl = '{n}';
  let emptyCopy = '';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const kind = (cells.pop()?.textContent || '').trim();
    const ps = cells[0] ? [...cells[0].querySelectorAll('p')] : [];
    const txt = (n) => (n?.textContent || '').trim();
    if (kind === 'search') placeholder = txt(cells[0]);
    if (kind === 'count') {
      countTpl = txt(ps[0]) || countTpl;
      emptyCopy = txt(ps[1]);
    }
  });
  const input = el('input', 'search-input');
  input.type = 'search';
  input.name = 'q';
  input.value = q;
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder || 'search');
  const btn = el('button', 'search-submit', uIcon('search', 'has-bg is-link'));
  btn.type = 'submit';
  btn.setAttribute('aria-label', placeholder || 'search');
  const form = el('form', 'search-form', el('div', 'search-form-content', input, btn));
  form.method = 'get';
  const info = el('div', 'search-info');
  const results = el('div', 'search-results');
  results.setAttribute('aria-live', 'polite');
  block.replaceChildren(form, info, results);
  if (!q) return;
  const prefix = `/${window.location.pathname.split('/').filter(Boolean)[0] || ''}/`.replace('//', '/');
  const hits = rankIndex(await loadIndex(), q, prefix);
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  info.append(el('div', 'search-count', hits.length ? countTpl.replace('{n}', hits.length) : (emptyCopy || countTpl.replace('{n}', 0))));
  hits.slice((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE).forEach((r) => {
    const a = el('a', '', cleanTitle(r.title));
    a.href = r.path;
    const h = el('h3', 'search-result-title', a);
    const content = el('div', 'search-result-content', el('p', 'mb-1', excerpt(r, terms)));
    results.append(el('div', 'search-result', el('div', 'search-result-teaser', h, content)));
  });
  const pages = Math.ceil(hits.length / PAGE_SIZE);
  if (pages > 1) {
    const ul = el('ul', 'search-pagination-list');
    for (let i = 1; i <= pages; i += 1) {
      const u = new URL(window.location.href);
      u.searchParams.set('page', i);
      const a = el('a', '', String(i));
      a.href = `${u.pathname}${u.search}`;
      ul.append(el('li', `search-page${i === pageNo ? ' is-active' : ''}`, a));
    }
    block.append(el('div', 'search-pagination', ul));
  }
}

export default async function decorate(block) {
  if (block.querySelector('.search-results, .search-form')) return;
  const uIcon = await iconFactory();
  if (block.classList.contains('index')) {
    await decorateIndex(block, uIcon);
    return;
  }
  const out = [];
  const results = el('div', 'search-results');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const kind = (cells.pop()?.textContent || '').trim();
    const [a, b] = cells;
    if (kind === 'search') {
      const input = el('input', 'search-input');
      input.type = 'search';
      input.name = 'q';
      input.placeholder = (a?.textContent || '').trim();
      input.setAttribute('aria-label', input.placeholder);
      const btn = el('button', 'search-submit', uIcon('search', 'has-bg is-link'));
      btn.type = 'submit';
      btn.setAttribute('aria-label', input.placeholder);
      const form = el('form', 'search-form', el('div', 'search-form-content', input, btn));
      form.method = 'get';
      out.push(form);
    } else if (kind === 'filters') {
      const header = el('div', 'search-tabs');
      const label = a.querySelector('p');
      if (label) header.append(el('div', 'search-tab is-label', ...label.childNodes));
      [...a.querySelectorAll('li')].forEach((li, i) => {
        const tab = el('div', `search-tab has-hover${i ? '' : ' is-active'}`, ...li.childNodes);
        tab.addEventListener('click', () => {
          header.querySelectorAll('.search-tab').forEach((t) => t.classList.toggle('is-active', t === tab));
        });
        header.append(tab);
      });
      out.push(header);
    } else if (kind === 'options') {
      const opts = el('div', 'search-options');
      // the authored <strong> marks the checked option; without one the first is checked
      const lis = [...a.querySelectorAll('li')];
      const marked = lis.findIndex((li) => li.querySelector('strong'));
      lis.forEach((li, i) => {
        const strong = li.querySelector('strong');
        if (strong) strong.replaceWith(...strong.childNodes);
        const on = marked >= 0 ? i === marked : i === 0;
        opts.append(el('span', `search-option${on ? ' is-checked' : ''}`, ...li.childNodes));
      });
      out.push(opts);
    } else if (kind === 'facets') {
      // source c-search__facet-tab-container: gray tabs, first active, trailing filler tab
      const bar = el('div', 'search-facets');
      [...a.querySelectorAll('li')].forEach((li, i) => {
        const tab = el('div', `search-facet${i ? '' : ' is-active'}`, ...li.childNodes);
        tab.querySelectorAll('em').forEach((em) => { em.className = 'search-facet-count'; });
        bar.append(tab);
      });
      bar.append(el('div', 'search-facet is-filler'));
      out.push(bar);
    } else if (kind === 'tag') {
      out.push(el('div', 'search-tag', el('span', 'search-tag-name', ...kids(a))));
    } else if (kind === 'count') {
      const [count, sort] = [...a.querySelectorAll('p')];
      const info = el('div', 'search-info');
      if (count) info.append(el('div', 'search-count', ...count.childNodes));
      if (sort) info.append(el('div', 'search-sort', el('strong', '', ...sort.childNodes), uIcon('chevron-down', 'is-sm has-bg ml-1')));
      out.push(info);
    } else if (kind === 'result') {
      const item = el('div', 'search-result');
      const img = a?.querySelector('picture, img');
      if (img) item.append(el('div', 'search-result-image', img.closest('picture') || img));
      const teaser = el('div', 'search-result-teaser');
      const nodes = kids(b).filter((n) => n.nodeType === 1);
      const h = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
      const meta = el('div', 'search-result-meta');
      nodes.slice(0, Math.max(h, 0)).forEach((p, i) => {
        meta.append(el('span', i ? 'search-result-date' : 'search-result-type', ...p.childNodes));
      });
      teaser.append(meta);
      if (h >= 0) {
        nodes[h].className = 'search-result-title';
        teaser.append(nodes[h]);
        const rest = nodes.slice(h + 1);
        const content = el('div', 'search-result-content');
        rest.forEach((p, i) => {
          if (i === rest.length - 1 && rest.length > 1 && /^\d+\s/.test(p.textContent.trim())) {
            content.append(el('div', 'search-result-download', uIcon('download-single', 'has-bg is-link'), el('span', 'search-result-download-count', ...p.childNodes)));
          } else {
            p.classList.add('mb-1');
            content.append(p);
          }
        });
        teaser.append(content);
      }
      item.append(teaser);
      results.append(item);
    } else if (kind === 'pagination') {
      const ul = a.querySelector('ul');
      if (ul) {
        ul.className = 'search-pagination-list';
        [...ul.children].forEach((li, i) => li.classList.add('search-page', ...(i ? [] : ['is-active'])));
        out.push(el('div', 'search-pagination', ul));
      }
    }
  });
  const infoIdx = out.findIndex((n) => n.classList.contains('search-info'));
  if (results.children.length) out.splice(infoIdx >= 0 ? infoIdx + 1 : out.length, 0, results);
  if (block.classList.contains('events')) {
    // variant events: source u-bg-lightgrey box around the search / tabs / options / tag rows
    const box = el('div', 'search-filter-box');
    const kinds = ['search-form', 'search-tabs', 'search-options', 'search-tag'];
    const first = out.findIndex((n) => kinds.some((k) => n.classList.contains(k)));
    const inBox = out.filter((n) => kinds.some((k) => n.classList.contains(k)));
    if (first >= 0) {
      box.append(...inBox);
      const rest = out.filter((n) => !inBox.includes(n));
      rest.splice(first, 0, box);
      block.replaceChildren(...rest);
      return;
    }
  }
  block.replaceChildren(...out);
}
