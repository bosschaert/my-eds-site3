/**
 * team-tabs — the source's `.tabs-section`: a strip of tabs and, per tab, one panel of team
 * cards (portrait, name, description). Authored rows: ONE ROW PER TAB — cell 1 holds the tab
 * label (a paragraph), every further cell holds one team card (its picture, a heading and a
 * paragraph). Decode tier: template-slotted for the tab strip and the panel shells,
 * reconstructive for the repeating cards, which are classified by content role (picture →
 * portrait, heading → name, paragraph → description), never by position.
 * Every authored node is MOVED into its wrapper (EW1). The tab label stays its authored <p>,
 * hosted by a `div[role=tab]` (EW7 — no <button> around authored text).
 * Behaviour mirrors the source's showTabSection(i): activating tab i sets `active` on tab i
 * and on panel i only; the first tab is active on load. decorate() is re-entrant (EW9).
 * @param {Element} block The team-tabs block element
 */

/**
 * Moves the medium (an outermost <picture> or a bare <img>) of a cell to the front of a card
 * and drops the paragraph the pipeline wrapped it in once that paragraph is empty.
 * @param {Element} cell authored cell
 * @param {Element} card target wrapper
 */
function slotMedia(cell, card) {
  const media = cell.querySelector('picture, img');
  if (!media) return;
  const holder = media.parentElement;
  card.append(media);
  if (holder !== cell && !holder.children.length && !holder.textContent.trim()) {
    holder.remove();
  }
}

/**
 * Activates one tab/panel pair and deactivates the others.
 * @param {Element[]} tabs tab hosts in order
 * @param {Element[]} panels panels in the same order
 * @param {number} index the pair to activate
 */
function activate(tabs, panels, index) {
  tabs.forEach((tab, i) => {
    const on = i === index;
    tab.classList.toggle('active', on);
    tab.setAttribute('aria-selected', on ? 'true' : 'false');
    tab.tabIndex = on ? 0 : -1;
  });
  panels.forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .team-tabs-nav')) return;

  const nav = document.createElement('div');
  nav.className = 'team-tabs-nav';
  nav.setAttribute('role', 'tablist');

  const tabs = [];
  const panels = [];
  const uid = Math.random().toString(36).slice(2, 8);

  [...block.children].forEach((row, index) => {
    const cells = [...row.children];
    const labelCell = cells.shift();

    const tab = document.createElement('div');
    tab.className = 'team-tabs-tab';
    tab.setAttribute('role', 'tab');
    tab.id = `team-tabs-${uid}-tab-${index}`;
    tab.setAttribute('aria-controls', `team-tabs-${uid}-panel-${index}`);
    if (labelCell) {
      [...labelCell.childNodes].forEach((node) => tab.append(node));
    }

    const panel = document.createElement('div');
    panel.className = 'team-tabs-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.id = `team-tabs-${uid}-panel-${index}`;
    panel.setAttribute('aria-labelledby', tab.id);

    cells.forEach((cell) => {
      const card = document.createElement('div');
      card.className = 'team-card';
      slotMedia(cell, card);
      [...cell.childNodes].forEach((node) => card.append(node));
      panel.append(card);
    });

    tabs.push(tab);
    panels.push(panel);
    nav.append(tab);
    row.remove();
  });

  block.append(nav, ...panels);
  activate(tabs, panels, 0);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tabs, panels, index));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'Enter' || event.key === ' ') next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (next === null) return;
      event.preventDefault();
      activate(tabs, panels, next);
      tabs[next].focus();
    });
  });
}
