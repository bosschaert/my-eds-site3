/**
 * hotspots — the source c-hotspots-image (infographic; orange plus/minus points, each opening a
 * white text box beside it).
 *
 * Content: row 1 = [<p><img></p>]; then one row per hotspot = [<p>left top side width</p>
 * (the source's inline percentages, e.g. "40.8% 66.2% right 59.2%"), rich text].
 * @ew-exempt the position cell is layout configuration, not displayed text.
 * Decoration (template-slotted): the image and box text nodes are MOVED (EW1); points, boxes
 * and indicator lines are chrome positioned from the config. Click / Enter on a point toggles
 * its box (one open at a time). Re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

export default function decorate(block) {
  if (block.querySelector('.hotspots-points')) return;
  const rows = [...block.children];
  const imgRow = rows.find((r) => r.querySelector('picture, img'));
  const points = el('div', 'hotspots-points');
  if (imgRow) points.append(...imgRow.querySelector('picture, img').closest('p, div').childNodes);
  const boxes = [];
  const triggers = [];
  rows.filter((r) => r !== imgRow).forEach((row) => {
    const [cfgCell, textCell] = row.children;
    const [left, top, side, width] = (cfgCell ? cfgCell.textContent.trim() : '').split(/\s+/);
    if (!left || !top || !textCell) return;
    const icon = el('span', 'u-icon-plus-minus');
    const trigger = el('span', 'u-icon is-lg has-bg is-link hotspots-trigger', icon);
    trigger.style.left = left;
    trigger.style.top = top;
    trigger.setAttribute('role', 'button');
    trigger.tabIndex = 0;
    const indicator = el('div', 'hotspots-indicator');
    indicator.style.left = left;
    indicator.style.height = `${100 - parseFloat(top)}%`;
    points.append(trigger, indicator);
    const box = el('div', 'hotspots-box', el('div', 'hotspots-box-content s-richtext', ...textCell.childNodes));
    const wrap = el('div', `hotspots-box-wrapper is-${side === 'left' ? 'left' : 'right'}`, box);
    if (width) wrap.style.width = width;
    wrap.style.left = left;
    wrap.style.top = top;
    boxes.push({ wrap, box, indicator });
    triggers.push({ trigger, icon });
  });
  const show = (idx) => {
    boxes.forEach((b, i) => {
      const on = i === idx && !b.box.classList.contains('is-visible');
      b.box.classList.toggle('is-visible', on);
      b.indicator.classList.toggle('is-visible', on);
      triggers[i].icon.classList.toggle('is-active', on);
    });
  };
  triggers.forEach(({ trigger }, i) => {
    trigger.addEventListener('click', () => show(i));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(i);
      }
    });
  });
  block.replaceChildren(points, ...boxes.map((b) => b.wrap));
}
