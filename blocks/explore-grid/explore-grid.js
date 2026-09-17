/**
 * Explore grid — reconstructive rows from stardust/eds-schema/index.json.
 * Each authored row is one tile: media cell, then linked label cell.
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'explore-items';

  [...block.children].forEach((row, index) => {
    const media = row.querySelector('picture, img');
    const link = row.querySelector('a');
    if (!link) return;

    const card = document.createElement('div');
    card.className = 'explore-card';
    if (index === 0) card.classList.add('explore-card-main');

    if (media) {
      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'explore-media';
      mediaWrap.append(media);
      card.append(mediaWrap);
    }

    const label = document.createElement('div');
    label.className = 'explore-label';
    const paragraph = link.closest('p');
    label.append(paragraph || link);
    card.append(label);
    grid.append(card);
  });

  const wrap = document.createElement('div');
  wrap.className = 'explore-wrap';
  wrap.append(grid);
  block.replaceChildren(wrap);
}
