/**
 * project-grid block — reconstructive (stardust/eds-conversion-log.md § Delivery design notes).
 * One authored row per project: a picture cell and a text cell holding the title link
 * and the item count. decorate() MOVES the authored nodes into the live tile shape
 * (`a.project > div > .project-image / .project-item-count` + `.project-title`; the inner
 * title anchor is unwrapped after its href is read — EW6) and lays the tiles out with the
 * live autocolumns masonry: columns = max(1, floor(W / 300)), gutter = W / 100, floored
 * heights, shortest column first (leftmost on ties); aspect from the image's width/height
 * attributes, else from naturalWidth/naturalHeight after load.
 * @param {Element} block The project-grid block element
 */

const COLUMN_WIDTH = 300;

function readAspect(tile) {
  const img = tile.querySelector('img');
  if (!img) return 1;
  const w = parseFloat(img.getAttribute('width')) || img.naturalWidth;
  const h = parseFloat(img.getAttribute('height')) || img.naturalHeight;
  if (w > 0 && h > 0) return h / w;
  return 1;
}

function layout(block) {
  const tiles = [...block.querySelectorAll(':scope > .project')];
  const width = block.clientWidth;
  if (!width || !tiles.length) return;
  const gutter = width / 100;
  const cols = Math.max(1, Math.floor(width / COLUMN_WIDTH));
  const colWidth = (width - (cols - 1) * gutter) / cols;
  const ys = new Array(cols).fill(0);
  tiles.forEach((tile) => {
    let col = 0;
    for (let k = 1; k < cols; k += 1) {
      if (ys[k] < ys[col] - 0.5) col = k;
    }
    const height = Math.floor(colWidth * readAspect(tile));
    tile.style.left = `${col * (colWidth + gutter)}px`;
    tile.style.top = `${ys[col]}px`;
    tile.style.width = `${colWidth}px`;
    tile.style.height = `${height}px`;
    tile.classList.add('positioned');
    ys[col] += height + gutter;
  });
  const total = Math.max(...ys) - gutter;
  block.style.height = `${total > 0 ? total : 0}px`;
}

function unwrapLink(link) {
  const parent = link.parentNode;
  while (link.firstChild) parent.insertBefore(link.firstChild, link);
  link.remove();
}

function buildTile(row) {
  const cells = [...row.children];
  const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
  const textCells = cells.filter((cell) => cell !== imageCell);
  const texts = textCells.flatMap((cell) => [...cell.children]);
  const link = textCells.map((cell) => cell.querySelector('a[href]')).find((a) => a);
  const titleNode = link ? link.closest('p, h1, h2, h3, h4, h5, h6') || link.parentElement : null;
  const countNode = texts.find((el) => el !== titleNode && /^\s*\d+\s*$/.test(el.textContent));
  const leftovers = texts.filter((el) => el !== titleNode && el !== countNode);

  const tile = document.createElement('a');
  tile.className = 'project';
  if (link) {
    tile.href = link.getAttribute('href');
    unwrapLink(link);
  }

  const inner = document.createElement('div');
  const image = document.createElement('div');
  image.className = 'project-image';
  const intrinsic = document.createElement('div');
  intrinsic.className = 'intrinsic';
  const fill = document.createElement('div');
  fill.className = 'content-fill';
  if (imageCell) {
    [...imageCell.children].forEach((el) => fill.append(el));
  }
  intrinsic.append(fill);
  image.append(intrinsic);

  const count = document.createElement('div');
  count.className = 'project-item-count';
  if (countNode) count.append(countNode);
  inner.append(image, count);

  const title = document.createElement('div');
  title.className = 'project-title';
  if (titleNode) title.append(titleNode);
  leftovers.forEach((el) => title.append(el));

  tile.append(inner, title);
  tile.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
    if (!img.complete) {
      img.addEventListener('load', () => layout(tile.parentElement), { once: true });
    }
  });
  return tile;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const tile = buildTile(row);
    row.replaceWith(tile);
  });
  block.classList.add('autocolumns');
  block.id = 'projectThumbs';

  layout(block);
  if (!block.dataset.gridObserved) {
    block.dataset.gridObserved = 'true';
    let raf = 0;
    window.addEventListener('resize', () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        layout(block);
      });
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => layout(block));
    }
    window.addEventListener('load', () => layout(block), { once: true });
  }
}
