/**
 * figure — one photo with a caption line underneath. Template-slotted: the authored
 * <picture> and caption <p> MOVE into the media / caption slots (EW1–EW10).
 * Schema: stardust/eds-schema/webpage-dyft29wzo0qlk.json sections[5] (figure item).
 *
 * Authoring rows (authors omit and add cells):
 *   - the photo (<picture>/<img>)
 *   - the caption paragraph(s) — any default-content element after the photo
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
  if (block.querySelector(':scope > .figure-media')) return; // re-entrant (EW9)
  const picture = block.querySelector('picture, img');
  const host = mediaHost(picture);
  const captionNodes = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((el) => el !== host && el !== picture);

  const media = slot('figure-media');
  if (picture) media.append(host);

  const caption = slot('figure-caption caption-wrap');
  captionNodes.forEach((el) => caption.append(el));
  // bare text left in a cell (harness-only, EW5): move the nodes, never copy text
  [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => cell.textContent.trim())
    .forEach((cell) => {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      caption.append(p);
    });

  block.replaceChildren(media, caption);
}
