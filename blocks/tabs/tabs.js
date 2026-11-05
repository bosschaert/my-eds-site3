/**
 * Tabs: one row per tab.
 * Cell 1: the tab label (the authored cell becomes the role="tab" control).
 * Cells 2..n: one team card each (portrait picture, <h4> name, <p> bio).
 * Authored nodes are moved, never rebuilt.
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .tab-buttons')) return;
  // the source's content-root class, so one gate scope fits both sides
  block.classList.add('tabs-section');
  const blockIndex = [...document.querySelectorAll('.tabs')].indexOf(block);
  const prefix = `tabs-${blockIndex < 0 ? 0 : blockIndex}`;

  const tablist = document.createElement('div');
  tablist.className = 'tab-buttons';
  tablist.setAttribute('role', 'tablist');
  const tabs = [];
  const panels = [];

  [...block.children].forEach((row) => {
    const [label, ...cards] = [...row.children];
    if (!label) return;
    const i = tabs.length;
    const panel = document.createElement('div');
    panel.className = 'tab-content';
    panel.setAttribute('role', 'tabpanel');
    panel.id = `${prefix}-panel-${i}`;
    label.id = `${prefix}-tab-${i}`;
    label.setAttribute('role', 'tab');
    label.setAttribute('aria-controls', panel.id);
    label.setAttribute('aria-selected', 'false');
    label.tabIndex = 0;
    panel.setAttribute('aria-labelledby', label.id);
    cards.forEach((card) => {
      card.className = 'team-card';
      panel.append(card);
    });
    tablist.append(label);
    tabs.push(label);
    panels.push(panel);
  });
  if (!tabs.length) return;

  const show = (idx) => {
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
      tab.setAttribute('aria-selected', String(i === idx));
    });
    panels.forEach((panel, i) => panel.classList.toggle('active', i === idx));
  };

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => show(idx));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(idx);
      }
    });
  });

  block.replaceChildren(tablist, ...panels);
  show(0);
}
