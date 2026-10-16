/**
 * fact-box — the source c-fact-box key-figure cards (title / subtitle head, big count-up number,
 * optional text foot) in the o-container grid. Shared by the hub (en-investors) and home (en).
 *
 * Content: one row per card — [head, number, text?]
 *   head:   1st paragraph = title, 2nd = subtitle.
 *   number: one paragraph; the <strong> part is the counted value as finally shown (formatted
 *           in the page language, e.g. 4.4 / 76,000), the text around it = prefix / suffix
 *           components (€ … bn). No <strong> → the whole number is static.
 *   text:   optional rich text (foot, bottom-aligned).
 * Variants: cols-4 | cols-3 (default) | cols-2 grid; white (card ground, lightgray default);
 *   yellow | number-white (number colour, black default).
 * Behaviour (live): heads and feet equalised per block; the counted value runs 0 → value over
 * 2000ms once fully in view (utils countUp). Template-slotted decode, nodes MOVED (EW1), EW9.
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

function numberFormat(text) {
  const lang = document.documentElement.lang || 'en';
  const locale = lang === 'en' ? 'en-US' : lang;
  let dec = '.';
  let group = ',';
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);
    dec = (parts.find((p) => p.type === 'decimal') || {}).value || dec;
    group = (parts.find((p) => p.type === 'group') || {}).value || group;
  } catch (e) {
    // keep en-US separators
  }
  const [int, frac = ''] = text.split(dec);
  const digits = int.replace(/[^0-9-]/g, '');
  if (!/\d/.test(digits)) return null;
  const to = Number(`${digits}.${frac.replace(/\D/g, '')}`);
  if (Number.isNaN(to)) return null;
  return {
    to,
    decimals: frac.replace(/\D/g, '').length,
    locale,
    separator: to < 1000 || int.includes(group) || /\s/.test(int.trim()),
  };
}

function buildNumber(cell) {
  const number = el('div', 'fact-box-number');
  const p = cell.querySelector('p') || cell;
  const comp = (cls, nodes) => {
    const span = el('span', cls, ...nodes);
    if (span.textContent.trim()) number.append(span);
    return span;
  };
  const strong = p.querySelector('strong, b');
  if (!strong) {
    comp('fact-box-number-component', [...p.childNodes]);
    return { number, counter: null };
  }
  const before = [];
  const after = [];
  let seen = false;
  [...p.childNodes].forEach((n) => {
    if (n === strong) seen = true;
    else (seen ? after : before).push(n);
  });
  comp('fact-box-number-component', before);
  const counter = comp('fact-box-countable fact-box-number-component', [...strong.childNodes]);
  comp('fact-box-number-component', after);
  return { number, counter };
}

export default async function decorate(block) {
  if (block.querySelector('.fact-box-item')) return;
  let utils = {};
  try {
    utils = await import('../../scripts/utils.js');
  } catch (e) {
    // structural harness without /scripts/: no equalising / count-up
  }
  const heads = [];
  const feet = [];
  const counters = [];
  const items = [...block.children].map((row) => {
    const cells = [...row.children];
    row.remove();
    if (!cells.length || !row.textContent.trim()) return null;
    const [headCell, numberCell, textCell] = cells;
    const card = el('div', 'fact-box-card');

    const head = el('div', 'fact-box-section');
    let paras = headCell ? [...headCell.querySelectorAll('p, h1, h2, h3, h4, h5, h6')] : [];
    // a single-paragraph cell arrives unwrapped (text directly in the cell)
    if (!paras.length && headCell && headCell.textContent.trim()) paras = [headCell];
    if (paras[0]) head.append(el('div', 'fact-box-title u-text-h4', ...paras[0].childNodes));
    if (paras[1]) head.append(el('div', 'fact-box-subtitle', ...paras[1].childNodes));
    card.append(head);
    heads.push(head);

    if (numberCell && numberCell.textContent.trim()) {
      const { number, counter } = buildNumber(numberCell);
      card.append(el('div', 'fact-box-section', number));
      if (counter) counters.push(counter);
    }

    const foot = el('div', 'fact-box-section fact-box-foot');
    if (textCell && textCell.textContent.trim()) {
      foot.append(el('div', 'fact-box-text s-richtext', ...textCell.childNodes));
    }
    card.append(foot);
    feet.push(foot);
    return el('div', 'fact-box-item', card);
  }).filter(Boolean);
  block.append(...items);

  if (utils.equalizeHeights) {
    const runHeads = utils.equalizeHeights(heads);
    const runFeet = utils.equalizeHeights(feet);
    // guarded (boxes with foot text — home): the section is still hidden while it loads, so the
    // first pass measures 0; re-run once the block has a size and after web fonts settle
    if (feet.some((f) => f.textContent.trim()) && window.ResizeObserver) {
      // source data-equalize-height sits on the c-fact-box__text itself (text top-aligned)
      const runTexts = utils.equalizeHeights(block.querySelectorAll('.fact-box-foot > .fact-box-text'));
      const ro = new ResizeObserver((entries) => {
        if (!entries.some((e) => e.contentRect.width)) return;
        ro.disconnect();
        const run = () => {
          runHeads();
          runTexts();
          runFeet();
        };
        run();
        if (document.fonts) document.fonts.ready.then(run);
      });
      ro.observe(block);
    }
  }
  if (utils.countUp) {
    counters.forEach((c) => {
      const fmt = numberFormat(c.textContent.trim());
      if (fmt) utils.countUp(c, fmt);
    });
  }
}
