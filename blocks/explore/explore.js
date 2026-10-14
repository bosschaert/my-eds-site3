/**
 * explore — "Explore What We Do": yellow-ruled heading over a 4-column tile grid (15vw rows,
 * first tile 2×2); each tile is a photo under a grey scrim with a centred uppercase label,
 * the whole tile links (hover: blue scrim + yellow border).
 *
 * Schema: stardust/eds-schema/index.json → sections[3] (heading; repeat DIV.explore__item ×5,
 * each 1 cta + 1 img).
 * Decode tier: reconstructive (authors add/remove tiles).
 *
 * Authoring (container shape, one row per tile — a flattened single cell also decodes):
 *   - <h2> section heading
 *   - per tile: <picture> | <p><a href>Tile label</a></p>
 * Tile boundary = each link paragraph; the picture seen before it is that tile's image.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    // wrapTextNodes folds a media-led cell into one <p> — expand it back (#104)
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    if (kids.length) out.push(...kids);
    // HARNESS-ONLY fallback (EW5): bare text cell — move its text nodes into a <p>
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function buildTile(link, picture) {
  // `explore__item` (unstyled alias) is the build selector of the stardust/replica/units.json
  // `explore-tiles` family the published-origin gate measures tile geometry with
  const item = el('div', 'explore-item explore__item');
  const tileLink = el('a', 'explore-link', { href: link.getAttribute('href') });
  const par = link.closest('p') || link;
  tileLink.append(par);
  // EW6: card-as-link — unwrap the authored inner anchor, its paragraph stays editable
  if (par !== link) link.replaceWith(...link.childNodes);
  item.append(tileLink);
  if (picture) item.append(picture);
  return item;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  let heading = null;
  const tiles = [];
  const leftovers = [];
  let pending = null;

  nodes.forEach((n) => {
    if (!heading && /^H[1-3]$/.test(n.tagName)) {
      heading = n;
    } else if (media(n) && !n.querySelector('a')) {
      if (pending) leftovers.push(pending);
      pending = media(n).closest('picture') || media(n);
    } else if (n.querySelector('a[href]')) {
      tiles.push(buildTile(n.querySelector('a[href]'), pending));
      pending = null;
    } else {
      leftovers.push(n);
    }
  });
  if (pending) leftovers.push(pending);

  const title = el('div', 'explore-title');
  if (heading) title.append(heading);
  const container = el('div', 'explore-container');
  const grid = el('div', 'explore-grid');
  grid.append(...tiles);
  container.append(grid, ...leftovers);
  block.replaceChildren(title, container);
}
