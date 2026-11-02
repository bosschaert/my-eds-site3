/**
 * explore-grid — "Explore What We Do": 4-column tile grid, first tile 2×2,
 * a label overlay on each tile.
 * Rows: one tile each — an image cell and a cell with the label link.
 * The overlay is a link: the authored anchor's href moves to it, the anchor is unwrapped and its
 * paragraph is moved inside; the picture is moved into the tile.
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .explore-grid-item')) return;

  [...block.children].forEach((row, index) => {
    const item = document.createElement('div');
    item.className = index === 0 ? 'explore-grid-item explore-grid-feature' : 'explore-grid-item';
    const link = row.querySelector('a[href]');
    const picture = row.querySelector('picture') || row.querySelector('img');
    const overlay = document.createElement('a');
    overlay.className = 'explore-grid-link';
    if (link) {
      overlay.href = link.getAttribute('href');
      if (link.title) overlay.title = link.title;
      const holder = link.closest('p') || link.parentElement;
      link.replaceWith(...link.childNodes);
      overlay.append(holder);
    }
    [...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].forEach((el) => {
      if (el.textContent.trim()) overlay.append(el);
    });
    item.append(overlay);
    if (picture) {
      const pictureHolder = picture.closest('p');
      item.append(picture);
      if (pictureHolder && !pictureHolder.textContent.trim() && !pictureHolder.children.length) {
        pictureHolder.remove();
      }
    }
    row.replaceWith(item);
  });
}
