/**
 * home-esg — home Sustainability panel (template-slotted head + reconstructive keywords).
 *
 * Authored rows (classified by content, never by index):
 *   head row      heading + description + CTA paragraph; a second cell holds the background
 *   keyword rows  an icon image + a keyword paragraph (any number)
 * Authored nodes are MOVED into the source DOM (centered title wrap, CTA, circle keyword list
 * on a horizontal axis line with a twinkling centre dot). Entrances replay whenever the section
 * gains .active from the home scroller.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/**
 * The delivery pipeline trims the spaces around an authored <br>; the source hides its
 * <br class="pc_br"> at narrow widths and the words keep their separating space there.
 */
function keepBreakSpaces(root) {
  root.querySelectorAll('br').forEach((br) => {
    const prev = br.previousSibling;
    if (prev && prev.nodeType === Node.TEXT_NODE && !/\s$/.test(prev.nodeValue)) br.before(' ');
  });
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .esg-wrap')) return; // re-entrant (EW9)
  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h1, h2, h3'));
  const keyRows = rows.filter((row) => row !== headRow && row.querySelector('picture, img'));

  const bg = el('div', 'bg');
  const esgWrap = el('div', 'esg-wrap');
  const inner = el('div', 'inner');
  if (headRow) {
    const titleWrap = el('div', 'main-title-wrap row-2');
    const title = el('div', 'main-title');
    title.append(headRow.querySelector('h1, h2, h3'));
    titleWrap.append(title);
    const ps = [...headRow.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
    const cta = ps.find((p) => p.querySelector('a'));
    ps.filter((p) => p !== cta).forEach((p) => {
      const d = el('div', 'main-title-desc');
      d.append(p);
      titleWrap.append(d);
    });
    inner.append(titleWrap);
    if (cta) {
      const btnWrap = el('div', 'btn-wrap');
      btnWrap.append(cta);
      inner.append(btnWrap);
    }
    const pic = headRow.querySelector('picture, img');
    if (pic) bg.append(pic.closest('p') || pic);
  }

  const keywordWrap = el('div', 'keyword-wrap');
  const list = el('ul', 'keyword-list');
  keyRows.forEach((row) => {
    const li = el('li');
    const top = el('div', 'half-area top-area');
    const ico = el('span', 'ico');
    const pic = row.querySelector('picture, img');
    ico.append(pic.closest('p') || pic);
    top.append(ico);
    const bottom = el('div', 'half-area bottom-area');
    [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img')).forEach((p) => {
      const text = el('div', 'text');
      text.append(p);
      bottom.append(text);
    });
    li.append(top, bottom, el('span', 'dot'));
    list.append(li);
  });
  keywordWrap.append(list);
  esgWrap.append(inner, keywordWrap);

  block.textContent = '';
  block.append(bg, esgWrap);
  keepBreakSpaces(block);
}
