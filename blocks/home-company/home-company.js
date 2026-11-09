/**
 * home-company — home "DOOSAN BOBCAT" panel (template-slotted head + reconstructive list).
 *
 * Authored rows (classified by content, never by index):
 *   head row   heading + description + CTA paragraph; a second cell holds the background image
 *   item rows  an icon image + a text paragraph (one per strength, any number)
 * Authored nodes are MOVED into the source DOM (centered title wrap, CTA, icon list, the five
 * decorative vertical lines). Entrances (icon/text stagger, lines) replay whenever the section
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
  if (block.querySelector(':scope > .inner')) return; // re-entrant (EW9)
  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h1, h2, h3'));
  const itemRows = rows.filter((row) => row !== headRow && row.querySelector('picture, img'));

  const inner = el('div', 'inner');
  const wrap = el('div', 'company-wrap');
  const bg = el('div', 'bg');

  if (headRow) {
    const titleWrap = el('div', 'main-title-wrap row-2');
    const heading = headRow.querySelector('h1, h2, h3');
    const title = el('div', 'main-title');
    title.append(heading);
    titleWrap.append(title);
    const ps = [...headRow.querySelectorAll('p')];
    const cta = ps.find((p) => p.querySelector('a') && !p.querySelector('picture, img'));
    const desc = ps.find((p) => p !== cta && !p.querySelector('picture, img'));
    if (desc) {
      const d = el('div', 'main-title-desc');
      d.append(desc);
      titleWrap.append(d);
    }
    wrap.append(titleWrap);
    if (cta) {
      const btnWrap = el('div', 'btn-wrap');
      btnWrap.append(cta);
      wrap.append(btnWrap);
    }
    const pic = headRow.querySelector('picture, img');
    if (pic) bg.append(pic.closest('p') || pic);
  }

  const list = el('ul', 'list');
  itemRows.forEach((row) => {
    const li = el('li');
    const ico = el('span', 'ico');
    const pic = row.querySelector('picture, img');
    ico.append(pic.closest('p') || pic);
    li.append(ico);
    [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img')).forEach((p) => {
      const text = el('div', 'text');
      text.append(p);
      li.append(text);
    });
    list.append(li);
  });
  wrap.append(list);

  const lines = el('div', 'line-wrap', { 'aria-hidden': 'true' });
  for (let i = 0; i < 5; i += 1) lines.append(el('span', 'line'));
  inner.append(wrap, lines);

  block.textContent = '';
  block.append(bg, inner);
  keepBreakSpaces(block);
}
