/**
 * tabs — the source o-tabs (header items with an orange active bar, one visible panel).
 *
 * Content: one row per tab.
 *   [label]          → the panel is the NEXT block after the tabs block in the same section
 *                      (panels in tab order; e.g. news-sidebar, teaser) — its wrapper is moved in.
 *   [label, content] → the panel is the second cell's content.
 *   [label, n]       → variant `panels`: the panel is the NEXT n wrappers (default-content runs
 *                      and blocks) after the tabs block — panels mixing text and blocks.
 *                      @ew-exempt the count cell is layout configuration, not displayed text.
 * Variants: header-gap (section header ends with an empty media row: +1.8286rem above),
 *   dark-line (black header line / bar, source o-container is-gray | is-pastel-yellow).
 * Behaviour (live): click / Enter on a header item → it gets .is-active, its panel .is-visible;
 * the first tab is open initially. Reconstructive decode: labels / panel nodes are MOVED (EW1);
 * re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

function isPanelWrapper(node) {
  return node && node.tagName === 'DIV' && /-wrapper$/.test(node.className.split(' ')[0] || '')
    && !node.classList.contains('default-content-wrapper');
}

export default function decorate(block) {
  if (block.querySelector('.tabs-header')) return;
  const wrapper = block.closest('.tabs-wrapper') || block;
  let next = wrapper.nextElementSibling;
  const header = el('div', 'tabs-header');
  header.setAttribute('role', 'tablist');
  const content = el('div', 'tabs-content');
  const triggers = [];
  const panels = [];
  const uid = `tabs-${Math.random().toString(36).slice(2, 8)}`;

  [...block.children].forEach((row, i) => {
    const [labelCell, panelCell] = row.children;
    const label = (labelCell || row).textContent.trim();
    if (!label) {
      row.remove();
      return;
    }
    const trigger = el('div', 'tabs-header-item has-hover', label);
    trigger.setAttribute('role', 'tab');
    trigger.tabIndex = 0;
    trigger.id = `${uid}-tab-${i}`;
    const panel = el('div', 'tabs-content-item');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', trigger.id);
    const count = block.classList.contains('panels') && panelCell
      ? parseInt(panelCell.textContent.trim(), 10) : NaN;
    if (count > 0) {
      // panels variant (cluster-content tabs-panels.mjs): the next `count` wrappers
      for (let k = 0; k < count && next; k += 1) {
        const after = next.nextElementSibling;
        panel.append(next);
        next = after;
      }
    } else if (panelCell && (panelCell.textContent.trim() || panelCell.querySelector('img, picture'))) {
      panel.append(...panelCell.childNodes);
    } else if (isPanelWrapper(next)) {
      const after = next.nextElementSibling;
      panel.append(next);
      next = after;
    }
    triggers.push(trigger);
    panels.push(panel);
    header.append(trigger);
    content.append(panel);
    row.remove();
  });

  const show = (idx) => {
    triggers.forEach((t, i) => {
      t.classList.toggle('is-active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    panels.forEach((p, i) => p.classList.toggle('is-visible', i === idx));
  };
  triggers.forEach((t, i) => {
    t.addEventListener('click', () => show(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(i);
      }
    });
  });
  block.append(header, content);
  show(0);
}
