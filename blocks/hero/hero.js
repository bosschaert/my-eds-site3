/**
 * hero — #courtyard: the full-bleed courtyard photograph; the page's h1 is
 * screen-reader-only because its words are painted in the photograph.
 * Schema: stardust/eds-schema/index.json sections[0] (hero). Decode tier: template-slotted.
 *
 * Authoring rows (positional):
 *   1. h1 (visually hidden)
 *   2. image — landscape art direction (> 640px)
 *   3. image — mobile art direction (<= 640px), optional; with one image it serves both
 */
// EW1/EW2: the generated wrapper carries the layout class; the authored node moves into it.
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const pictures = [...new Set([...block.querySelectorAll('picture, img')]
    .map((el) => el.closest('picture') || el))];
  const frag = document.createDocumentFragment();
  if (heading) frag.append(wrapNode(heading, 'hero-title'));
  const mobile = window.matchMedia('(width <= 640px)').matches;
  pictures.forEach((pic, i) => {
    let role = 'hero-media hero-media-single';
    if (pictures.length > 1) {
      role = i === 0 ? 'hero-media hero-media-landscape' : 'hero-media hero-media-mobile';
    }
    frag.append(wrapNode(pic, role));
    const img = pic.matches('img') ? pic : pic.querySelector('img');
    const shown = pictures.length === 1 || (mobile ? i === 1 : i === 0);
    if (img && shown) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
  });
  block.replaceChildren(frag);
}
