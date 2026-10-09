/**
 * hero — title section of the Jamaica travel guide: full-bleed background photo,
 * gradient overlay and a centred title stack (title + subtitle). Template-slotted:
 * the authored nodes MOVE into empty slot containers (EW1–EW10, never copied).
 * Schema: stardust/eds-schema/webpage-dyft29wzo0qlk.json sections[0].
 *
 * Authoring rows (authors omit and add cells):
 *   - a background image (<picture>/<img>, anywhere in the block)
 *   - the page headline as a real <h1> (the only <h1> of the page)
 *   - a subtitle paragraph (first link-free <p>)
 * Any other authored element is kept in the title stack (leftovers pass).
 */

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

// the element to MOVE for a picture: its wrapping <p> when the <p> holds nothing else
function mediaHost(pic) {
  if (!pic) return null;
  const p = pic.closest('p');
  if (p && p.children.length === 1 && !p.textContent.trim()) return p;
  return pic;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-stage')) return; // re-entrant (EW9)
  const media = block.querySelector('picture, img');
  const host = mediaHost(media);
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const subtitle = [...block.querySelectorAll('p')]
    .find((p) => p !== host && !p.querySelector('picture, img') && p.textContent.trim());
  const rest = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((el) => el !== host && el !== heading && el !== subtitle && el.textContent.trim());

  const bg = slot('hero-bg');
  if (media) {
    const img = media.matches('img') ? media : media.querySelector('img');
    if (img) img.loading = 'eager';
    bg.append(host);
  }

  const stage = slot('hero-stage');
  const stack = slot('hero-stack');
  const overlay = document.createElement('span');
  overlay.className = 'hero-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  stack.append(overlay);
  if (heading) {
    const headline = slot('hero-headline');
    headline.append(heading);
    stack.append(headline);
  }
  if (subtitle) {
    const sub = slot('hero-subtitle');
    sub.append(subtitle);
    stack.append(sub);
  }
  rest.forEach((el) => stack.append(el));
  stage.append(stack);

  const hint = slot('hero-hint');
  block.replaceChildren(bg, stage, hint);
}
