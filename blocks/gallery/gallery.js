/**
 * gallery — two-column media grid (source: <figure> of images, and of videos).
 * Authored model: cells (any number of rows) each holding one image, or — variant
 * `videos` — one paragraph with a link to an .mp4 plus the fallback text, e.g.
 * "Your browser does not support embedded video. [Download recording 1]."
 * The paragraph is MOVED into the <video> as its fallback content.
 * @param {Element} block The block element
 */
function videoLabel(link) {
  const text = link.textContent.replace(/^\s*download\s+/i, '').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function decorateVideo(cell) {
  const link = [...cell.querySelectorAll('a[href]')].find((a) => /\.(mp4|webm|mov)(\?|#|$)/i.test(a.href));
  if (!link) return;
  const video = document.createElement('video');
  video.controls = true;
  video.setAttribute('playsinline', '');
  video.preload = 'metadata';
  video.width = 362;
  video.height = 308;
  const label = videoLabel(link);
  if (label) video.setAttribute('aria-label', label);
  const source = document.createElement('source');
  source.src = link.getAttribute('href');
  source.type = 'video/mp4';
  video.append(source);
  link.removeAttribute('title');
  const holder = link.closest('p');
  if (holder) {
    // MOVE the authored fallback paragraph (text + download link) into the video
    holder.replaceWith(video);
    video.append(holder);
  } else {
    video.append(...cell.childNodes);
    cell.append(video);
  }
}

export default function decorate(block) {
  const isVideos = block.classList.contains('videos');
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      cell.classList.add('gallery-item');
      if (isVideos || !cell.querySelector('picture, img')) decorateVideo(cell);
      cell.querySelectorAll('p > picture').forEach((picture) => {
        const p = picture.parentElement;
        if (p.children.length === 1 && !p.textContent.trim()) p.replaceWith(picture);
      });
    });
  });
}
