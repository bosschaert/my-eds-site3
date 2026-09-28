/**
 * Host note — "Welcome to my home." (source `section.room-section#host`, stardust:replica
 * of www.niravmanubhai.com). Decode tier: TEMPLATE-SLOTTED. Schema:
 * stardust/eds-schema/index.json → section "room-section" #1 (heading + 4 body, 1 image).
 *
 * Authoring (flat cell, schema order):
 *   1. <h2> section title
 *   2. <p> intro line (the italic Playfair sub-title)
 *   3..n <p> note paragraphs
 *   image — the host portrait (moved into `.host-note-portrait`)
 *
 * Every authored node is MOVED (EW1): heading → `.host-note-heading`, the first
 * paragraph after it → `.host-note-intro`, the remaining paragraphs → `.host-note-copy`,
 * the picture → `.host-note-portrait`. Wrappers carry the layout classes; the authored
 * elements are styled through descendant selectors (EW2). Re-entrant (EW9).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const MEDIA = 'picture, img';

function mediaOf(el) {
  return el.matches(MEDIA) ? el : el.querySelector(MEDIA);
}

/** Cell-level collector: the DA-flattened single cell and one-item-per-row both decode. */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector(MEDIA)) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // harness-only (EW5): a bare text node beside an image — wrap the node, never copy it
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): bare text cell
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default function decorate(block) {
  if (block.querySelector(':scope > .wrap')) return;
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3'));
  const media = nodes.map((n) => mediaOf(n)).find(Boolean);
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && n.textContent.trim());
  const headingIndex = heading ? nodes.indexOf(heading) : -1;
  const afterHeading = texts.filter((n) => nodes.indexOf(n) > headingIndex);
  const beforeHeading = texts.filter((n) => nodes.indexOf(n) < headingIndex);
  const [intro, ...rest] = afterHeading;
  const copy = [...beforeHeading, ...rest];

  const section = block.closest('.section');
  if (section && !section.id) section.id = section.dataset.id || 'host';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (heading) wrap.append(wrapNode(heading, 'host-note-heading'));
  if (intro) wrap.append(wrapNode(intro, 'host-note-intro'));

  const figure = document.createElement('div');
  figure.className = 'host-note-figure';
  const note = document.createElement('div');
  note.className = 'host-note-copy';
  note.append(...copy);
  figure.append(note);
  if (media) figure.append(wrapNode(media, 'host-note-portrait'));
  wrap.append(figure);

  block.replaceChildren(wrap);
}
