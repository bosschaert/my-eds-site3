/**
 * accordion — the source o-accordion (bordered items, label + orange plus/minus icon, panel
 * opens below).
 *
 * Content: one row per item — [label, panel]. The label cell's <p> is MOVED into the header
 * (EW1, no <button> hosts it — EW7: the header div carries role="button"); the panel cell's
 * nodes are MOVED into the content (rich text). Every item starts closed (source default).
 * Variant panels (cluster-hub accordion-panels.mjs): a row [label, <p>n</p>] takes the next n
 * wrappers after the accordion block (default-content runs and blocks of a panel that holds
 * blocks) as its panel, in item order. @ew-exempt the count cell is layout configuration.
 * Behaviour (live): click / Enter / Space on a header toggles .is-open on the item; the icon
 * gets .is-active. Re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

export default function decorate(block) {
  if (block.querySelector('.accordion-item')) return;
  const uid = `accordion-${Math.random().toString(36).slice(2, 8)}`;
  const panels = block.classList.contains('panels');
  let next = (block.closest('.accordion-wrapper') || block).nextElementSibling;
  [...block.children].forEach((row, i) => {
    const [labelCell, panelCell] = row.children;
    if (!labelCell || !labelCell.textContent.trim()) {
      row.remove();
      return;
    }
    const icon = el('span', 'u-icon-plus-minus');
    const header = el('div', 'accordion-header');
    if (block.classList.contains('events')) {
      // events: [logo p, date p, time p, title p, location p] → logo | text column
      const ps = [...labelCell.children];
      const logo = ps.find((p) => p.querySelector('img, picture'));
      const text = el('div', 'accordion-event-text');
      const lines = ps.filter((p) => p !== logo);
      const titleIdx = lines.findIndex((p) => p.querySelector('strong'));
      const when = el('div', 'accordion-event-when');
      lines.forEach((p, k) => {
        if (k < titleIdx) when.append(p);
        else if (k === titleIdx) text.append(when, el('div', 'accordion-event-title', p));
        else text.append(el('div', 'accordion-event-where', p));
      });
      if (titleIdx < 0) text.append(...lines);
      const ev = el('div', 'accordion-event');
      if (logo) ev.append(el('div', 'accordion-event-logo', logo));
      ev.append(text);
      header.append(ev);
    } else {
      header.append(...labelCell.childNodes);
    }
    header.append(el('span', 'u-icon has-bg is-link accordion-icon', icon));
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.tabIndex = 0;
    header.id = `${uid}-h-${i}`;
    const inner = el('div', 'accordion-content-inner s-richtext');
    const count = panels && panelCell && /^\d+$/.test(panelCell.textContent.trim())
      ? parseInt(panelCell.textContent.trim(), 10) : 0;
    if (count > 0) {
      for (let k = 0; k < count && next; k += 1) {
        const after = next.nextElementSibling;
        inner.append(next);
        next = after;
      }
    } else if (panelCell) inner.append(...panelCell.childNodes);
    const content = el('div', 'accordion-content', inner);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', header.id);
    const item = el('div', 'accordion-item', header, content);
    const toggle = () => {
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      icon.classList.toggle('is-active', open);
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    row.replaceWith(item);
  });
}
