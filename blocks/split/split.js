/**
 * split — image + text + CTAs band (prototype section.sm-split; schema
 * stardust/eds-schema/index.json sections 1, 6, 8: heading, body…, cta…, 1 image).
 *
 * Decode tier: template-slotted. Authored (any row/cell shape, DA-flattened ok):
 *   <img> · <h2> · optional opening-hours <ul> (days, time) · body <p>… ·
 *   CTA <p>s (<strong><a> primary green, <em><a> secondary maroon)
 * Variants: `reverse` (image right), `art-windmill` / `art-wheat` (decorative
 * artwork, CSS only). Authored nodes are MOVED into the slots (EW1/EW3).
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

// A CTA paragraph holds exactly one link and no other text (decorateButtons shape).
function isCta(el) {
  const links = el.tagName === 'P' ? el.querySelectorAll('a') : [];
  return links.length === 1 && el.textContent.trim() === links[0].textContent.trim()
    && !!links[0].closest('strong, em, .button');
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const isMedia = (n) => n.matches('picture, img');
  const media = nodes.find(isMedia);
  const heading = nodes.find((n) => n.matches(HEADING));
  const hours = nodes.find((n) => n.matches('ul, ol'));
  const ctas = nodes.filter((n) => isCta(n));
  const body = nodes.filter((n) => ![media, heading, hours].includes(n) && !ctas.includes(n));

  const mediaSlot = slot('split-media js-show-on-scroll-img');
  if (media) mediaSlot.append(media);

  const text = slot('split-text');
  if (heading) text.append(slot('split-heading', heading));
  if (hours) text.append(slot('split-hours', slot('split-hours-info', hours)));
  if (body.length) text.append(slot('sm-rich split-body', ...body));
  if (ctas.length) text.append(slot('split-ctas', ...ctas));

  const inner = slot('split-inner js-show-on-scroll', mediaSlot, text);
  const parts = [inner];
  if ([...block.classList].some((c) => c.startsWith('art-'))) {
    parts.push(slot('split-art js-show-on-scroll-img'));
  }
  block.replaceChildren(...parts);
}
