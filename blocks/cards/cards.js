/**
 * cards — the card flipbook: a title card (photo + centred <h2>) followed by one card
 * per highlight (photo + <h3> + paragraph), each on its own card ground. Reconstructive:
 * one authored row per card; cells may be one (flat siblings) or several; cards are
 * classified by content, never by index (EW1–EW10: every authored node MOVES).
 * Schema: stardust/eds-schema/webpage-dyft29wzo0qlk.json sections[4] (4 units, not uniform:
 * the first unit is the centred title card — its heading is one level above the others).
 *
 * Authoring rows (one per card, authors omit and add cells):
 *   - photo (<picture>/<img>), heading (<h2> title card / <h3> card), paragraphs
 */

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function cardNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    let kids = [...cell.children];
    // #104: a media-led cell folded into ONE <p> by the runtime — expand it back
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length > 1
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        if (!n.textContent.trim()) return null;
        const p = document.createElement('p');
        p.append(n);
        return p;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // bare text (harness-only, EW5): move the nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function isMedia(el) {
  if (el.matches('picture, img')) return true;
  return el.matches('p') && !!el.querySelector('picture, img') && !el.textContent.trim();
}

function buildCard(row, titleLevel) {
  const nodes = cardNodes(row);
  const card = slot('cards-card');
  const heading = nodes.find((el) => /^H[1-6]$/.test(el.tagName));
  if (heading && heading.tagName === titleLevel) card.classList.add('center');
  else card.classList.add('left');

  const media = slot('cards-card-image');
  const body = slot('cards-card-body');
  nodes.forEach((el) => {
    if (isMedia(el)) media.append(el);
    else body.append(el);
  });
  if (media.childElementCount) card.append(media);
  if (body.childElementCount) card.append(body);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cards-list')) return; // re-entrant (EW9)
  const rows = [...block.children];
  if (!rows.length) return;
  // the title card carries the highest heading level present (the section title)
  const levels = rows
    .map((row) => row.querySelector('h1, h2, h3, h4, h5, h6'))
    .filter(Boolean)
    .map((h) => h.tagName);
  const distinct = [...new Set(levels)].sort();
  const titleLevel = distinct.length > 1 ? distinct[0] : null;

  const lead = slot('cards-lead');
  const list = slot('cards-list');
  rows.forEach((row) => list.append(buildCard(row, titleLevel)));
  block.replaceChildren(lead, list);
}
