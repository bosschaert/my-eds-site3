/**
 * hero — full-bleed photo hero with the copy pinned bottom-left over a scrim
 * (prototype section.sm-hero; schema stardust/eds-schema/index.json section 0:
 * heading, body, cta, 1 image).
 *
 * Decode tier: template-slotted. Authored (any row/cell shape, DA-flattened ok):
 *   <img> (hero photo) · <h1> · lede <p> · CTA <p><strong><a></a></strong></p>
 * Every authored node is MOVED into the template slots (EW1/EW3).
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

// Flat list of the authored elements across every cell. A <p> that only wraps a
// picture yields the picture (the empty paragraph is discarded with the rows).
// HARNESS-ONLY fallback (EW5): a text-only cell is wrapped by MOVING its text nodes.
function collectNodes(root) {
  const out = [];
  root.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (!kids.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
      return;
    }
    kids.forEach((el) => {
      const media = el.querySelector('picture, img');
      if (el.tagName === 'P' && media && !el.textContent.trim()) {
        out.push(media.closest('picture') || media);
      } else if (el.tagName === 'P' && media) {
        [...el.childNodes].forEach((n) => {
          if (n.nodeType === 1) out.push(n);
          else if (n.textContent.trim()) {
            const p = document.createElement('p');
            p.append(n);
            out.push(p);
          }
        });
      } else out.push(el);
    });
  });
  return out;
}

function slot(className, ...nodes) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const isMedia = (n) => n.matches('picture, img');
  const media = nodes.find(isMedia);
  const heading = nodes.find((n) => n.matches(HEADING));
  const ctas = nodes.filter((n) => !isMedia(n) && n !== heading && n.querySelector('a'));
  const rest = nodes.filter((n) => n !== media && n !== heading && !ctas.includes(n));

  const mediaSlot = slot('hero-media');
  if (media) mediaSlot.append(media);

  const copy = slot('hero-copy');
  if (heading) copy.append(slot('hero-heading', heading));
  if (rest.length) copy.append(slot('hero-text', ...rest));
  if (ctas.length) copy.append(slot('hero-actions', ...ctas));

  block.replaceChildren(mediaSlot, copy, slot('hero-scrim'));
}
