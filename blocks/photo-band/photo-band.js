/**
 * photo-band — a 50vh cover photo above (variant `image-left`) or below (variant
 * `image-right`) a prose column (heading + paragraphs). Template-slotted: the
 * authored nodes MOVE into the media / body slots (EW1–EW10, never copied).
 * Schema: stardust/eds-schema/webpage-dyft29wzo0qlk.json sections[2] and [3].
 *
 * Authoring rows (authors omit and add cells):
 *   - the photo (<picture>/<img>)
 *   - optional config row `focus | <x%> <y%>` — the photo's focal point
 *     (source background-position), applied as object-position
 *   - the prose: heading + paragraphs (any default-content element)
 * @ew-exempt <p> focus (config row, two cells) — config, never displayed
 */

const FOCUS_KEYS = ['focus', 'position', 'focal point'];
const FOCUS_VALUE = /^[\d.]+%?(\s+[\d.]+%?)?(\s+(left|right|top|bottom|center))*$/i;

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

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length !== 2 || cells[0].querySelector('picture, img')) return;
    const key = cells[0].textContent.trim().toLowerCase();
    if (!FOCUS_KEYS.includes(key)) return;
    config.focus = cells[1].textContent.trim();
    row.remove();
  });
  return config;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .photo-band-media')) return; // re-entrant (EW9)
  const config = readConfig(block);
  const picture = block.querySelector('picture, img');
  const host = mediaHost(picture);
  const bodyNodes = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((el) => el !== host && el !== picture);

  const media = slot('photo-band-media');
  if (picture) {
    const img = picture.matches('img') ? picture : picture.querySelector('img');
    if (img && config.focus && FOCUS_VALUE.test(config.focus)) {
      img.style.objectPosition = config.focus;
    }
    media.append(host);
  }

  const body = slot('photo-band-body');
  bodyNodes.forEach((el) => body.append(el));
  // bare text left in a cell (harness-only, EW5): move the nodes, never copy text
  [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => cell.textContent.trim())
    .forEach((cell) => {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      body.append(p);
    });

  block.replaceChildren(media, body);
}
