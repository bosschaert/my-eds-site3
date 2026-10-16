/**
 * job-search — the source con-jobs search widget (c-job-widget-search, an Angular app on the
 * source; dynamic-features row 11): white search box with keyword, location and proximity
 * fields, the "offers for" type toggle and the submit button.
 *
 * Content (one row per field, strings verbatim from the source widget):
 *   [<p>keyword label</p>, <p>placeholder</p>] · [<p>location label</p>, <p>placeholder</p>] ·
 *   [<p>proximity label</p>, <p>option</p>…] · [<p>offers-for label</p>, <p>option</p>…]
 *   (optional) · [<p><a href="https://jobs.continental.com/<lang>/#/">submit label</a></p>].
 * Behaviour (live): submit → <portal>?searchTerm=<keyword> (+ radius when not 50 km, jobType=
 * apprenticeship for the second type on the de portal), as the source widget builds it. The
 * location suggest (Microsoft Bing, consent) is not available: proximity stays disabled.
 * @ew-exempt placeholder cells — moved into the inputs' placeholder attributes (form chrome).
 * Reconstructive decode: labels / options are MOVED (EW1); re-entrant (EW9).
 */
import { createIcon } from '../../scripts/utils.js';

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

const paras = (cell) => (cell ? [...cell.querySelectorAll('p')] : []);

function label(text, forId) {
  const node = el('label', 'job-search-label');
  node.htmlFor = forId;
  if (text) node.append(...text.childNodes);
  return node;
}

function inputField(row, id, icon) {
  const [labelCell, phCell] = row ? [...row.children] : [];
  const item = el('div', `job-search-item is-${id}`);
  const input = el('input', 'job-search-input');
  input.type = 'text';
  input.id = `${id}-${Math.random().toString(36).slice(2, 7)}`;
  input.name = id;
  input.placeholder = (phCell?.textContent || '').trim();
  const wrap = el('div', 'job-search-input-wrap', input, el('i', 'u-icon is-sm job-search-icon', createIcon(icon)));
  item.append(label(paras(labelCell)[0], input.id), wrap);
  return { item, input };
}

export default function decorate(block) {
  if (block.querySelector('.job-search-box')) return;
  const rows = [...block.children];
  const submitRow = rows.find((r) => r.children.length === 1 && r.querySelector('a[href]'));
  const fields = rows.filter((r) => r !== submitRow);
  const [kwRow, locRow, radiusRow, typeRow] = fields;
  const form = el('form', 'job-search-box');
  form.setAttribute('role', 'search');
  const kw = inputField(kwRow, 'keyword', 'search');
  const loc = inputField(locRow, 'location', 'marker');

  const radius = el('div', 'job-search-item is-radius is-disabled');
  const select = el('select', 'job-search-select');
  select.id = `radius-${Math.random().toString(36).slice(2, 7)}`;
  select.disabled = true;
  const [rLabel, rOptions] = radiusRow ? [...radiusRow.children] : [];
  paras(rOptions).forEach((p) => {
    const opt = el('option', '');
    opt.value = parseInt(p.textContent, 10) || p.textContent.trim();
    opt.append(...p.childNodes);
    select.append(opt);
  });
  select.value = '50';
  const chevron = el('i', 'u-icon is-xs job-search-icon is-right', createIcon('chevron-right'));
  radius.append(label(paras(rLabel)[0], select.id), el('div', 'job-search-input-wrap', select, chevron));
  form.append(kw.item, loc.item, radius);

  let typeInputs = [];
  if (typeRow) {
    const [tLabel, tOptions] = [...typeRow.children];
    const type = el('div', 'job-search-item is-type');
    const head = el('div', 'job-search-label job-search-type-label');
    const first = paras(tLabel)[0];
    if (first) head.append(...first.childNodes);
    const group = el('div', 'job-search-radio-group');
    const name = `type-${Math.random().toString(36).slice(2, 7)}`;
    typeInputs = paras(tOptions).map((p, i) => {
      const radio = el('input', 'job-search-radio');
      radio.type = 'radio';
      radio.name = name;
      radio.value = i === 0 ? 'job' : 'apprenticeship';
      radio.checked = i === 0;
      const span = el('span', '', ...p.childNodes);
      group.append(el('label', 'job-search-radio-label', radio, span));
      return radio;
    });
    type.append(head, group);
    form.append(type);
  }

  const link = submitRow?.querySelector('a[href]');
  const portal = link ? link.href : 'https://jobs.continental.com/en/#/';
  const button = el('button', 'c-button job-search-submit');
  button.type = 'submit';
  if (link) button.append(...link.childNodes);
  const source = el('div', 'job-search-source');
  if (link) source.append(link.closest('p') || link);
  form.append(el('div', 'job-search-item is-submit', button));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (kw.input.value.trim()) params.set('searchTerm', kw.input.value.trim());
    if (select.value && select.value !== '50') params.set('radius', select.value);
    const type = typeInputs.find((r) => r.checked);
    if (type && type.value === 'apprenticeship' && /\/de\/#/.test(portal)) params.set('jobType', 'apprenticeship');
    const q = params.toString();
    window.location.href = `${portal}${q ? `?${q}` : ''}`;
  });

  const searchbox = el('div', 'job-search-searchbox', form);
  rows.forEach((r) => r.remove());
  block.append(searchbox, source);
}
