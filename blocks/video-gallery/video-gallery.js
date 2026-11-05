/**
 * Video gallery: one row per video.
 * Cell 1: the video label (becomes the video's accessible name).
 * Cell 2: a fallback paragraph whose link points at the mp4; the paragraph is
 * moved inside the <video> as its no-support fallback.
 *
 * @ew-exempt <div> label (cell 1) — text-as-metadata, used as the video aria-label, never displayed
 * @param {Element} block The video-gallery block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > video')) return;
  const videos = [];
  [...block.children].forEach((row) => {
    const [labelCell, fallbackCell] = [...row.children];
    const link = row.querySelector('a[href]');
    if (!link) return;
    const src = new URL(link.href, window.location.href);
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.width = 362;
    video.height = 308;
    const label = labelCell && fallbackCell ? labelCell.textContent.trim() : '';
    if (label) video.setAttribute('aria-label', label);
    const source = document.createElement('source');
    source.src = src.origin === window.location.origin ? src.pathname : src.href;
    source.type = 'video/mp4';
    video.append(source);
    const fallback = link.closest('p') || link;
    video.append(fallback);
    videos.push(video);
  });
  if (videos.length) block.replaceChildren(...videos);
}
