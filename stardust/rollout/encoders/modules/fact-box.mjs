/**
 * fact-box — TYPO3 `.c-fact-box` key-figure cards (count-up numbers). Shared with home (en).
 * Claims a grid `.row` whose non-empty columns each hold exactly one fact box (→ ONE block), or a
 * lone `.c-fact-box` (one-box block).
 * Block: fact-box. One row per box: [head, number, text]
 *   head:   <p>c-fact-box__title</p> (+ <p>c-fact-box__subtitle</p>)
 *   number: ONE <p>: the number components in order; the countable component is <strong> and
 *           holds the FINAL value as the source shows it after the count-up (data-count-to
 *           formatted with data-count-locale, data-count-decimals decimals, thousands separator
 *           unless data-count-tsdsep="0"), e.g. <p>€<strong>4.4</strong>bn</p>.
 *   text:   the c-fact-box__text rich text (cleaned) — cell omitted when empty.
 * Variants: grid cols-4 (col-md-3) | cols-3 (col-md-4, default) | cols-2 (col-sm-6 only);
 *   box ground `white` (is-white; lightgray default); number colour `yellow` / `number-white`
 *   (is-black default) — read from the first box.
 */
export const match = '.row, .c-fact-box';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

function finalValue(span) {
  const to = Number(span.attr('data-count-to'));
  if (Number.isNaN(to)) return txt(span);
  const dec = Number(span.attr('data-count-decimals') || 0);
  const loc = (span.attr('data-count-locale') || 'en-US').replace('_', '-');
  if (span.attr('data-count-tsdsep') === '0') return String(Math.floor(to * 10 ** dec) / 10 ** dec);
  return to.toLocaleString(loc, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function boxRow($, box, ctx) {
  const b = $(box);
  const title = txt(b.find('.c-fact-box__title').first());
  const sub = txt(b.find('.c-fact-box__subtitle').first());
  const head = `${title ? `<p>${esc(title)}</p>` : ''}${sub ? `<p>${esc(sub)}</p>` : ''}`;
  const parts = b.find('.c-fact-box__number .c-fact-box__number-component').get().map((s) => {
    const span = $(s);
    if (span.is('.c-fact-box__countable')) return `<strong>${esc(finalValue(span))}</strong>`;
    return esc(txt(span));
  });
  if (!parts.length) {
    const n = txt(b.find('.c-fact-box__number').first());
    if (n) parts.push(esc(n));
  }
  const number = parts.length ? `<p>${parts.join('')}</p>` : '';
  const textEl = b.find('.c-fact-box__text').first();
  const text = textEl.length && txt(textEl) ? ctx.cleanChildren(textEl).trim() : '';
  const row = [head, number];
  if (text) row.push(text);
  return row;
}

function variants($, box, colClass) {
  const v = [];
  const c = (colClass || '').split(/\s+/);
  if (c.includes('col-md-3')) v.push('cols-4');
  else if (c.includes('col-sm-6') && !c.some((x) => x.startsWith('col-md-'))) v.push('cols-2');
  const b = $(box);
  if (b.is('.is-white')) v.push('white');
  const num = b.find('.c-fact-box__number').first();
  if (num.is('.is-yellow')) v.push('yellow');
  else if (num.is('.is-white')) v.push('number-white');
  return v;
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  if (node.is('.c-fact-box')) {
    const col = node.closest('[class*="col-"]');
    return ctx.block('fact-box', variants($, el, col.attr('class')), [boxRow($, el, ctx)]);
  }
  const cols = node.children().get().filter((c) => $(c).children().length);
  if (!cols.length) return null;
  const boxes = cols.map((c) => $(c).find('> .o-page__ce > .c-fact-box'));
  if (boxes.some((b) => b.length !== 1)) return null;
  const rows = boxes.map((b) => boxRow($, b.get(0), ctx));
  return ctx.block('fact-box', variants($, boxes[0].get(0), $(cols[0]).attr('class')), rows);
}
