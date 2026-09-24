/**
 * media-grid — the source's media `<table>`: one row of cells, each cell one medium (an image
 * or the YouTube embed). Template-slotted: the pipeline's row and cell divs ARE the table row
 * and cell shells and receive the layout classes; the authored picture/img is moved to the
 * cell itself (EW1 — nothing is rebuilt) so no paragraph box sits around it.
 * A cell whose content is an embed URL (the captured `https://www.youtube.com/embed/<id>`,
 * authored as text or as a link — DA has no iframe) gets the source's iframe built from that
 * URL; the authored paragraph stays in the cell inside a hidden source wrapper.
 * decorate() is re-entrant (EW9).
 * @ew-exempt embed URL paragraph — a configuration value (the iframe src), not display copy
 * @param {Element} block The media-grid block element
 */

const EMBED_HOSTS = /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com)$/i;

/**
 * Reads the embed URL authored in a cell (a link, else the cell's text) or returns null.
 * @param {Element} cell authored cell
 * @returns {URL|null}
 */
function embedUrl(cell) {
  const link = cell.querySelector('a[href]');
  const raw = link ? link.href : cell.textContent.trim();
  try {
    const url = new URL(raw, window.location.href);
    return EMBED_HOSTS.test(url.hostname) ? url : null;
  } catch (e) {
    return null;
  }
}

/**
 * Builds the source's iframe for an embed URL.
 * @param {URL} url embed URL
 * @returns {HTMLIFrameElement}
 */
function buildIframe(url) {
  const iframe = document.createElement('iframe');
  iframe.src = url.href;
  iframe.width = '560';
  iframe.height = '315';
  iframe.title = /youtu/i.test(url.hostname) ? 'YouTube video' : 'Embedded video';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  );
  iframe.setAttribute('allowfullscreen', '');
  return iframe;
}

/**
 * Moves a cell's medium (outermost <picture> or bare <img>) to the cell itself and drops the
 * paragraph the pipeline wrapped it in once that paragraph is empty.
 * @param {Element} cell authored cell
 * @returns {boolean} whether the cell holds a medium
 */
function slotMedia(cell) {
  const media = cell.querySelector('picture, img');
  if (!media) return false;
  const holder = media.parentElement;
  if (holder !== cell) {
    cell.append(media);
    if (!holder.children.length && !holder.textContent.trim()) holder.remove();
  }
  return true;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('media-grid-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('media-grid-cell');
      if (cell.querySelector(':scope > iframe')) return;
      if (slotMedia(cell)) return;
      const url = embedUrl(cell);
      if (!url) return;
      const source = document.createElement('div');
      source.className = 'media-grid-embed-source';
      [...cell.childNodes].forEach((node) => source.append(node));
      cell.append(buildIframe(url), source);
    });
  });
}
