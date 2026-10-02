/**
 * explore-grid — "Explore What We Do": the 4-column tile grid whose first tile spans 2×2,
 * each tile a photo under a translucent label that is the link (template
 * `section.section-exploregrid`, index-proposed.css § Explore grid).
 *
 * Decode tier: reconstructive. Rows are classified by content, never by index: every row
 * carrying a picture is a tile — the picture and the linked paragraph (the label; the tile
 * is the link, EW6: the inner anchor is unwrapped once its href is read); any other authored
 * element in the row stays inside the label box (leftovers pass). Rows without a picture
 * degrade to visible default content under the grid.
 */
function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** the EXISTING authored elements of one cell (#62/#104) */
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
    && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      // harness-only (EW5): a bare text node beside the image moves into a fresh <p>
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.append(n);
        return p;
      }
      return null;
    }).filter(Boolean);
  }
  if (!kids.length && cell.textContent.trim()) {
    // harness-only (EW5): a bare-text cell — its text nodes move, never copied
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

function rowNodes(row) {
  return [...row.children].flatMap(cellNodes);
}

function buildTile(row, index) {
  const nodes = rowNodes(row);
  const media = nodes.find((n) => n.matches('picture, img'));
  const labelP = nodes.find((n) => n !== media && n.querySelector('a[href]'));
  const link = labelP ? labelP.querySelector('a[href]') : null;

  const item = el('div', `grid-item grid-item-${index + 1}`);
  const content = el('a', 'grid-item-content');
  if (link) {
    content.href = link.href;
    if (link.title) content.title = link.title;
  }
  if (labelP) {
    content.append(labelP);
    if (link) link.replaceWith(...link.childNodes);
  }
  nodes.filter((n) => n !== media && n !== labelP).forEach((n) => content.append(n));
  item.append(content);
  if (media) item.append(media);
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  const tileRows = rows.filter((r) => r.querySelector('picture, img'));
  const otherRows = rows.filter((r) => !tileRows.includes(r));

  const container = el('div', 'container');
  const row = el('div', 'row justify-content-center');
  const col = el('div', 'col-md-12');
  const section = el('div', 'section-grid section-explore-grid');
  const grid = el('div', 'grid');
  grid.append(...tileRows.map(buildTile));
  section.append(grid);
  col.append(section);
  row.append(col);
  container.append(row);
  otherRows.forEach((r) => {
    const lo = el('div', 'row');
    const c = el('div', 'col');
    rowNodes(r).forEach((n) => c.append(n));
    lo.append(c);
    container.append(lo);
  });
  block.replaceChildren(container);
}
