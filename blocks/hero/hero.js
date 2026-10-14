/**
 * hero — full-bleed 70vh background video under a #009bd9 multiply overlay, with a white
 * call-out card (headline + one pill CTA). Replica of balbriggan.ie `.hero`.
 *
 * Schema: stardust/eds-schema/index.json → sections[0] (heading, cta).
 * Decode tier: template-slotted (fixed composition; authored nodes are MOVED into slots).
 *
 * Authoring (any row/cell shape — decoded by query, never by row index):
 *   - <h1> headline (the page's single h1)
 *   - <p><strong><a href>Learn More</a></strong></p> — CTA (buttonized by decorateButtons)
 *   - <p><a href="https://…/video.mp4">…</a></p> — background video source on an external
 *     host or the code origin (never content.da.live: anonymous visitors get 401). Authored
 *     as DEFAULT CONTENT in the hero's section, before the block (David's Model D1: no embed
 *     URLs inside a block); the block reabsorbs it (the paragraph moves into the <video> as
 *     its fallback content) and removes the emptied wrapper. A link inside the block is still
 *     accepted (defensive fallback).
 *
 * @ew-exempt <p> video source link — text-as-metadata, consumed as the <video> source
 */

const VIDEO_RE = /\.(mp4|webm|m3u8)(\?|#|$)/i;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * Background video: autoplay muted loop playsinline (source behaviour, dynamic-features row 8).
 * @param {string} src video URL
 * @returns {HTMLVideoElement}
 */
function buildVideo(src, fallback) {
  const video = el('video', 'hero-video');
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  ['autoplay', 'muted', 'loop', 'playsinline'].forEach((attr) => video.setAttribute(attr, ''));
  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.append(source);
  // the authored link paragraph becomes the video's fallback content (moved, never copied)
  if (fallback) video.append(fallback);
  return video;
}

/**
 * The video link authored as default content before the block (section head, reabsorbed).
 * @param {Element} block
 * @returns {{ link: Element, wrapper: Element } | null}
 */
function findSectionVideo(block) {
  const prev = block.parentElement && block.parentElement.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const link = [...prev.querySelectorAll('a[href]')]
    .find((a) => VIDEO_RE.test(a.getAttribute('href')));
  return link ? { link, wrapper: prev } : null;
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const links = [...block.querySelectorAll('a[href]')];
  const sectionVideo = findSectionVideo(block);
  const videoLink = sectionVideo
    ? sectionVideo.link
    : links.find((a) => VIDEO_RE.test(a.getAttribute('href')));
  const ctas = links.filter((a) => a !== videoLink && !(heading && heading.contains(a)));

  const card = el('div', 'hero-card');
  if (heading) card.append(wrapNode(heading, 'hero-title'));
  if (ctas.length) {
    const actions = el('div', 'hero-actions');
    ctas.forEach((a) => actions.append(a.closest('p') || a));
    card.append(actions);
  }

  const media = el('div', 'hero-media');
  let video;
  if (videoLink) {
    video = buildVideo(videoLink.href, videoLink.closest('p') || videoLink);
    media.append(video);
  }

  block.replaceChildren(card, media, el('div', 'hero-overlay'));
  if (sectionVideo && !sectionVideo.wrapper.children.length) sectionVideo.wrapper.remove();

  if (video) {
    const playing = video.play();
    if (playing && playing.catch) playing.catch(() => {});
  }
}
