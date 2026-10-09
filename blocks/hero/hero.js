/**
 * hero — the source's `.teaser--home-hero` (image behind a translucent black wash, centred
 * white title + lead). Template-slotted (#95): the prototype's inner DOM as EMPTY slot
 * wrappers, the authored nodes MOVED in by role (EW1). Schema: stardust/eds-schema/
 * fr-startseite.json § hero (2 images, 2 texts).
 *
 * Authoring rows (any order, classified by content — never by index, #42):
 *   - picture row: the DESKTOP image (≥ 768px)
 *   - picture row: the MOBILE image (< 768px) — optional; without it the desktop image serves both
 *   - text row: <h1> headline, then the lead <p> (every other text falls into the lead slot)
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
  const heading = block.querySelector('h1, h2, h3, h4');
  const texts = [...block.querySelectorAll('p, ul, ol')]
    .filter((el) => !el.querySelector('picture, img') && el.textContent.trim());

  const teaser = slot('hero-teaser');
  const media = slot('hero-media');
  const content = slot('hero-content');
  const [desktopPic, mobilePic] = pics;
  if (desktopPic) {
    const desktop = slot('hero-media-desktop');
    const img = slot('img');
    img.append(desktopPic);
    desktop.append(img);
    media.append(desktop);
  }
  if (mobilePic) {
    const mobile = slot('hero-media-mobile');
    const img = slot('img');
    img.append(mobilePic);
    mobile.append(img);
    media.append(mobile);
  } else if (desktopPic) {
    media.classList.add('hero-media-single');
  }
  // LCP: the rendition the current breakpoint shows loads eagerly (#100)
  const mobileView = window.matchMedia('(width <= 767px)').matches;
  const lcp = (mobileView && mobilePic) || desktopPic;
  let lcpImg = null;
  if (lcp) lcpImg = lcp.tagName === 'IMG' ? lcp : lcp.querySelector('img');
  if (lcpImg) {
    lcpImg.setAttribute('loading', 'eager');
    lcpImg.setAttribute('fetchpriority', 'high');
  }
  if (heading) {
    const title = slot('hero-title');
    title.append(heading);
    content.append(title);
  }
  if (texts.length) {
    const desc = slot('hero-desc');
    desc.append(...texts);
    content.append(desc);
  }
  if (media.firstElementChild) teaser.append(media);
  if (content.firstElementChild) teaser.append(content);
  block.replaceChildren(teaser);
}
