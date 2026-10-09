/**
 * video-poster — the source's Kaltura player (.cmp-video; partner 432521 / uiconf 30358591 /
 * entry 1_7kar7zpp) in its CAPTURED poster state: the static thumbnail stretched to the 16:9
 * player box the embed script sizes (height = round(width × 9/16)), no iframe at load. The
 * player loads on click only, from the link the poster is authored in — never a source-host
 * src. Template-slotted (#95): empty slot wrappers, the authored picture MOVED in with its
 * link (EW1). The section title above the block is DEFAULT CONTENT, styled in place by this
 * block's CSS (D1). Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-see-the-
 * pattrns-about-amylodosis-attr.json § video.
 *
 * Authoring — ONE row: the poster picture wrapped in a link to the player's iframe-embed URL
 * (the no-JS fallback opens the player page); alt text verbatim from live. Any other authored
 * node stays visible below the player (leftovers pass).
 * @param {Element} block the block element
 */
function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default async function decorate(block) {
  const pics = [...block.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')));
  const poster = pics[0];
  if (!poster) return;
  const link = poster.closest('a');
  const media = link || poster;
  const rest = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((node) => !node.contains(media) && node.textContent.trim());

  const holder = slot('video-holder');
  const player = slot('video-player');
  const box = slot('video-box');
  const thumb = slot('video-thumb');
  thumb.append(media);
  box.append(thumb);
  player.append(box);
  holder.append(player);
  const out = [holder];
  if (rest.length) {
    const text = slot('video-text');
    text.append(...rest);
    out.push(text);
  }
  block.replaceChildren(...out);

  // the embed script sizes the player to a 16:9 box of its own width (664px @1440, 203px @360);
  // blocks decorate while their section is still hidden (width 0), so the height follows the
  // player's real width through a ResizeObserver (CSS aspect-ratio is the no-JS fallback)
  const size = () => {
    if (player.clientWidth > 0) player.style.height = `${Math.round(player.clientWidth * (9 / 16))}px`;
  };
  size();
  if (typeof ResizeObserver === 'function') new ResizeObserver(size).observe(player);
  else window.addEventListener('resize', size);

  if (!link) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (box.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = link.href;
    frame.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('title', link.getAttribute('aria-label') || '');
    box.append(frame);
    box.classList.add('video-playing');
  });
}
