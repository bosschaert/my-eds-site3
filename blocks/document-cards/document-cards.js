/**
 * Document cards — reconstructive rows from stardust/eds-schema/index.json.
 * Each authored row is one document: media cell, then linked h3 cell.
 */
export default function decorate(block) {
  const allDownloadsParagraph = [...block.querySelectorAll('p')].find(
    (paragraph) => paragraph.querySelector('a') && !paragraph.closest('h3, h4'),
  );
  const list = document.createElement('div');
  list.className = 'document-list';

  [...block.children].forEach((row) => {
    const media = row.querySelector('picture, img');
    const heading = row.querySelector('h3, h4');
    if (!heading) return;

    const card = document.createElement('figure');
    card.className = 'doc-card document-card';
    if (media) {
      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'document-media';
      mediaWrap.append(media);
      card.append(mediaWrap);
    }
    const title = document.createElement('div');
    title.className = 'document-title';
    title.append(heading);
    card.append(title);
    list.append(card);
  });

  const allDownloads = document.createElement('div');
  allDownloads.className = 'all-downloads';
  if (allDownloadsParagraph) allDownloads.append(allDownloadsParagraph);

  const wrap = document.createElement('div');
  wrap.className = 'document-wrap';
  wrap.append(list, allDownloads);
  block.replaceChildren(wrap);
}
