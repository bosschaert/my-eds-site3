/**
 * hero — full-bleed video band (70vh) with the blue multiply overlay and a centred white card.
 * Content: the card heading, the CTA link, and a paragraph holding only the background video
 * link (mp4) — consumed as the <video> source.
 * The authored card nodes are moved into the generated wrappers, never rebuilt.
 * @ew-exempt config: the video paragraph is a URL consumed as the <video> source
 */

function isVideoLink(a) {
  return /\.(mp4|webm)(\?|$)/i.test(new URL(a.href, window.location.href).pathname)
    || /player\.vimeo\.com\/external\//i.test(a.href);
}

function buildVideo(href) {
  const video = document.createElement('video');
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');
  const source = document.createElement('source');
  source.type = 'video/mp4';
  source.src = href;
  video.append(source);
  return video;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-media')) return;

  const media = document.createElement('div');
  media.className = 'hero-media';
  const body = document.createElement('div');
  body.className = 'hero-body';
  const card = document.createElement('div');
  card.className = 'hero-card';
  body.append(card);
  const videoBox = document.createElement('div');
  videoBox.className = 'hero-video';
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => card.append(...cell.childNodes));
    row.remove();
  });

  // the background video: a paragraph holding only a link to an mp4 (anywhere in the card cell)
  let videoHref = '';
  [...card.querySelectorAll('a[href]')].forEach((a) => {
    const holder = a.closest('p');
    if (videoHref || !holder || !isVideoLink(a)) return;
    if (holder.textContent.trim() !== a.textContent.trim()) return;
    videoHref = a.href;
    holder.remove();
  });

  // the page title h1 (register R2): the source has none; kept for assistive tech, never painted
  card.querySelectorAll('h1').forEach((h1) => h1.classList.add('hero-page-title'));

  media.append(body);
  if (videoHref) {
    videoBox.append(buildVideo(videoHref));
    media.append(videoBox);
  }
  media.append(overlay);
  block.append(media);

  const video = videoBox.querySelector('video');
  if (video) {
    const play = video.play();
    if (play && play.catch) play.catch(() => {});
  }
}
