/**
 * photo-grid — tiled photo groups: one authored row per group, one cell per tile.
 * A 3-tile group lays out 50 / 25 / 25 (source t3-layout-lpp-1), a 2-tile group 50 / 50
 * (t2-layout-pp-1). Reconstructive: tiles are classified by their media, never by index;
 * the authored <picture> MOVES into its tile (EW1–EW10).
 * Schema: stardust/eds-schema/webpage-dyft29wzo0qlk.json sections[6] (images only).
 *
 * Authoring rows (authors omit and add cells): per row, one photo per cell.
 */

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

// the element to MOVE for a picture: its wrapping <p> when the <p> holds nothing else
function mediaHost(pic) {
  const p = pic.closest('p');
  if (p && p.children.length === 1 && !p.textContent.trim()) return p;
  return pic;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .photo-group-container')) return; // re-entrant (EW9)
  const groups = [];
  [...block.children].forEach((row) => {
    const pictures = [...row.querySelectorAll('picture, img')]
      .filter((el) => !(el.matches('img') && el.closest('picture')));
    if (!pictures.length) return;
    const container = slot('photo-group-container');
    const group = slot(`photo-group tiles-${Math.min(pictures.length, 4)}`);
    pictures.forEach((pic) => {
      const tile = slot('photo-container tile');
      const image = slot('photo-image');
      image.append(mediaHost(pic));
      tile.append(image);
      group.append(tile);
    });
    container.append(group);
    groups.push(container);
  });
  if (groups.length) block.replaceChildren(...groups);
}
