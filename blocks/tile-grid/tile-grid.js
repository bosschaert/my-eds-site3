/**
 * tile-grid — the source's `.container--3-column-wrap` of `teaser--image-top-text-bottom`
 * cards (image on top, tinted body: title, copy, indication links). Reconstructive (#95):
 * authors add and remove cards. Schema: stardust/eds-schema/fr-startseite.json § ta-grid
 * (3 units: 2 images, 1 title, copy, links each).
 *
 * Authoring — ONE ROW PER CARD, cells in any split (classified by content, never by index):
 *   - picture(s): the DESKTOP image first, the MOBILE image (< 768px) second (optional)
 *   - the card title as <h4> (or <h3>), then the copy: <p> paragraphs, lists, a <p> of
 *     indication links separated by line breaks (plain links — not buttons)
 * Also decodes the DA-flattened single-cell shape (#52): the most frequent heading tag
 * opens a card; pictures before a heading belong to the card it opens.
 * Section head (intro paragraphs and the h3 title above the grid) is DEFAULT CONTENT in
 * the same section, styled in place by this block's CSS (`.tile-grid-container`).
 * @param {Element} block the block element
 */
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function slot(tag, className) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

/** Every image of a text-less node (a cell may hold two pictures in ONE <p>, #104),
 *  each moved with its wrapping link when the source links the image. */
function mediaIn(node) {
  if (node.matches('picture, img')) return [node.closest('a') || node];
  return [...node.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')))
    .map((el) => el.closest('a') || el);
}

/** Flat authored nodes of a row: cell children, pictures unwrapped from their <p>. */
function rowNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): a bare-text cell — move the text node into a <p>, never copy it
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function buildCard(group) {
  const item = slot('div', 'tile-item');
  const card = slot('article', 'tile-card');
  const media = slot('div', 'tile-media');
  const body = slot('div', 'tile-body');
  const [desktopPic, mobilePic] = group.pics;
  if (desktopPic) {
    const d = slot('div', 'tile-media-desktop');
    const img = slot('div', 'img');
    img.append(desktopPic);
    d.append(img);
    media.append(d);
  }
  if (mobilePic) {
    const m = slot('div', 'tile-media-mobile');
    const img = slot('div', 'img');
    img.append(mobilePic);
    m.append(img);
    media.append(m);
  } else if (desktopPic) {
    media.classList.add('tile-media-single');
  }
  if (group.heading) {
    const title = slot('div', 'tile-title');
    title.append(group.heading);
    body.append(title);
  }
  if (group.rest.length) {
    const desc = slot('div', 'tile-desc');
    desc.append(...group.rest);
    body.append(desc);
  }
  if (media.firstElementChild) card.append(media);
  if (body.firstElementChild) card.append(body);
  item.append(card);
  return item;
}

/** One group per authored row: pictures → media, first heading → title, the rest → copy. */
function groupFromNodes(nodes) {
  const group = { pics: [], heading: null, rest: [] };
  nodes.forEach((node) => {
    const pics = mediaIn(node);
    if (pics.length && !node.textContent.trim()) {
      group.pics.push(...pics);
      return;
    }
    if (!group.heading && node.matches(HEADINGS)) {
      group.heading = node;
      return;
    }
    group.rest.push(node);
  });
  return group;
}

/** DA-flattened shape (#52/#76): segment one cell's flat siblings on the card heading tag. */
function segmentFlat(nodes) {
  const counts = {};
  nodes.filter((n) => n.matches(HEADINGS)).forEach((n) => {
    counts[n.tagName] = (counts[n.tagName] || 0) + 1;
  });
  const tag = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const groups = [];
  let pending = [];
  let current = null;
  nodes.forEach((node) => {
    const pics = mediaIn(node);
    if (pics.length && !node.textContent.trim()) {
      if (current && !current.rest.length) current.pics.push(...pics);
      else pending.push(...pics);
      return;
    }
    if (node.tagName === tag) {
      current = { pics: pending, heading: node, rest: [] };
      pending = [];
      groups.push(current);
      return;
    }
    if (!current) {
      current = { pics: pending, heading: null, rest: [] };
      pending = [];
      groups.push(current);
    }
    current.rest.push(node);
  });
  if (pending.length) {
    if (current) current.pics.push(...pending);
    else groups.push({ pics: pending, heading: null, rest: [] });
  }
  return groups;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  let groups;
  const flat = rows.length === 1 && rows[0].children.length === 1
    && rows[0].querySelectorAll(HEADINGS).length > 1;
  if (flat) groups = segmentFlat(rowNodes(rows[0]));
  else groups = rows.map((row) => groupFromNodes(rowNodes(row)));

  const grid = slot('div', 'tile-row');
  groups.forEach((g) => grid.append(buildCard(g)));
  block.replaceChildren(grid);
}
