/**
 * team-tabs — tabbed team cards (the source's `.tabs-section`), shared by the
 * index and page1 templates. Schema: stardust/eds-schema/index.json section 3
 * (3 × tab-content, each 2 × team-card: img + heading + bio).
 * Decode tier: reconstructive — one authored row per tab; the card cell is
 * segmented by content (a picture or heading opens a card), never by index.
 *
 * Authoring (one row per tab, two cells):
 *   cell 1: the tab name (a paragraph)
 *   cell 2: the tab's cards, flat: <img> (portrait) · <h3> name · <p> bio, repeated
 * A row with a single cell is tolerated: its first paragraph before any image /
 * heading is the tab name.
 *
 * Behaviour (stardust/replica/motion/index.json): a click on tab i adds `active`
 * to tab i and panel i and removes it from the others; the panel fade is CSS.
 * EW7: the authored name paragraph is the visible label inside `div.tab`; the
 * generated <button role="tab"> (no text, aria-labelledby → the label) sits
 * beside it and takes focus/keyboard; the whole `.tab` takes the click.
 */

const MEDIA = 'picture, img';
const HEAD = 'h1, h2, h3, h4, h5, h6';
const has = (el, sel) => el.matches(sel) || !!el.querySelector(sel);

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

/** Segment a flat sibling list into cards: media or a heading opens a new card. */
function segmentCards(nodes) {
  const cards = [];
  let card = null;
  const open = () => {
    card = { media: null, heading: null, rest: [] };
    cards.push(card);
  };
  nodes.forEach((node) => {
    if (has(node, MEDIA)) {
      if (!card || card.media || card.heading) open();
      card.media = node;
    } else if (has(node, HEAD)) {
      if (!card || card.heading) open();
      card.heading = node;
    } else {
      if (!card) open();
      card.rest.push(node);
    }
  });
  return cards;
}

function buildCard({ media, heading, rest }) {
  const el = document.createElement('div');
  el.className = 'team-card';
  if (media) {
    const pic = media.matches(MEDIA) ? media : media.querySelector(MEDIA);
    const holder = pic.closest('p');
    el.append(wrapNode(pic, 'team-card-photo'));
    // the emptied image paragraph carries no text; drop it
    if (holder && !holder.textContent.trim()) holder.remove();
    else if (holder) rest.unshift(holder);
  }
  if (heading) el.append(wrapNode(heading, 'team-card-name'));
  rest.forEach((node) => el.append(wrapNode(node, 'team-card-bio')));
  return el;
}

function readRow(row) {
  const cells = [...row.children];
  const nameCell = cells.find((c) => !has(c, MEDIA) && !has(c, HEAD));
  let label = nameCell ? nameCell.querySelector('p, h1, h2, h3, h4, h5, h6') : null;
  const panelCells = cells.filter((c) => c !== nameCell);
  let nodes = panelCells.flatMap((c) => [...c.children]);
  if (!nameCell && nodes.length) {
    // single-cell row: the first text element before any media / heading is the name
    const first = nodes[0];
    if (!has(first, MEDIA) && !has(first, HEAD)) {
      label = first;
      nodes = nodes.slice(1);
    }
  }
  return { label, nodes };
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const id = `team-tabs-${[...document.querySelectorAll('.team-tabs')].indexOf(block) + 1}`;

  const list = document.createElement('div');
  list.className = 'tab-buttons';
  list.setAttribute('role', 'tablist');
  const tabs = [];
  const panels = [];

  rows.forEach((row, i) => {
    const { label, nodes } = readRow(row);
    const panel = document.createElement('div');
    panel.className = 'tab-content';
    panel.id = `${id}-panel-${i + 1}`;
    panel.setAttribute('role', 'tabpanel');
    segmentCards(nodes).forEach((card) => panel.append(buildCard(card)));

    const tab = document.createElement('div');
    tab.className = 'tab';
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `${id}-tab-${i + 1}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    tab.append(button);
    if (label) {
      label.id = `${id}-label-${i + 1}`;
      button.setAttribute('aria-labelledby', label.id);
      tab.append(label);
    }
    panel.setAttribute('aria-labelledby', button.id);
    list.append(tab);
    tabs.push(tab);
    panels.push(panel);
  });

  const select = (index) => {
    tabs.forEach((t, i) => {
      const on = i === index;
      t.classList.toggle('active', on);
      const b = t.querySelector('button');
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, i) => p.classList.toggle('active', i === index));
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
  });
  list.addEventListener('keydown', (e) => {
    const current = tabs.findIndex((t) => t.classList.contains('active'));
    let next = -1;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    tabs[next].querySelector('button').focus();
  });
  select(0);

  block.replaceChildren(list, ...panels);
}
