/**
 * documents — "Documents for Download": centred auto-width columns, each a cover image and a
 * linked title; even columns put the title under the cover.
 * Rows: one document each — a cover image cell and a cell with the title heading
 * (a link to the file).
 * The authored heading and picture are moved; the cover's link takes the title link's href.
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .documents-item')) return;

  [...block.children].forEach((row, index) => {
    const item = document.createElement('div');
    item.className = index % 2 ? 'documents-item documents-item-even' : 'documents-item';
    const inner = document.createElement('div');
    inner.className = 'documents-inner';
    item.append(inner);

    const link = row.querySelector('a[href]');
    const picture = row.querySelector('picture') || row.querySelector('img');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (link && /\.pdf(\?|#|$)/i.test(link.getAttribute('href'))) {
      link.target = '_blank';
    }
    if (heading) inner.append(heading);
    [...row.querySelectorAll('p')].forEach((p) => {
      if (p.textContent.trim()) inner.append(p);
    });
    if (picture) {
      const figure = document.createElement('figure');
      const pictureHolder = picture.closest('p');
      if (link) {
        const coverLink = document.createElement('a');
        coverLink.href = link.getAttribute('href');
        if (link.target) coverLink.target = link.target;
        coverLink.append(picture);
        figure.append(coverLink);
      } else {
        figure.append(picture);
      }
      if (pictureHolder && !pictureHolder.textContent.trim() && !pictureHolder.children.length) {
        pictureHolder.remove();
      }
      inner.append(figure);
    }
    row.replaceWith(item);
  });
}
