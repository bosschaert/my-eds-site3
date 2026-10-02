/**
 * Story feature — "The Story Nursery" band (source `section.story-nursery-home#story-nursery`,
 * stardust:replica of www.niravmanubhai.com). Decode tier: TEMPLATE-SLOTTED. Schema:
 * stardust/eds-schema/index.json → section "story-nursery-home" (eyebrow, heading, body, cta).
 *
 * Authoring (flat cell, schema order):
 *   1. <p> eyebrow (short label above the title)
 *   2. <h2> title
 *   3. image (the nursery photograph, 2:1 crop)
 *   4..n <p> copy
 *   last <p><a>…</a></p> — the underlined text link (a plain link, not a button)
 *
 * All authored nodes are MOVED (EW1): eyebrow → `.story-feature-eyebrow`, heading →
 * `.story-feature-heading`, picture → `.story-feature-image`, copy → `.story-feature-copy`,
 * link paragraph(s) → `.story-feature-cta` inside the copy. Eyebrow vs copy is decided by
 * ORDER (text before the heading = eyebrow), never by "first paragraph". Re-entrant (EW9).
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

const hasLink = (el) => el.matches('a') || !!el.querySelector('a');

export default function decorate(block) {
  if (block.querySelector(':scope > .story-feature-wrap')) return;
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3'));
  const media = nodes.map((n) => mediaOf(n)).find(Boolean);
  const headingIndex = heading ? nodes.indexOf(heading) : -1;
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && n.textContent.trim());
  const eyebrows = texts.filter((n) => nodes.indexOf(n) < headingIndex && !hasLink(n));
  const ctas = texts.filter((n) => hasLink(n));
  const copy = texts.filter((n) => !eyebrows.includes(n) && !ctas.includes(n));

  const section = block.closest('.section');
  if (section && !section.id) section.id = section.dataset.id || 'story-nursery';

  const wrap = document.createElement('div');
  wrap.className = 'story-feature-wrap';
  eyebrows.forEach((p) => wrap.append(wrapNode(p, 'story-feature-eyebrow')));
  if (heading) wrap.append(wrapNode(heading, 'story-feature-heading'));
  if (media) wrap.append(wrapNode(media, 'story-feature-image'));

  const copyBox = document.createElement('div');
  copyBox.className = 'story-feature-copy';
  copyBox.append(...copy);
  ctas.forEach((p) => copyBox.append(wrapNode(p, 'story-feature-cta')));
  if (copyBox.childElementCount) wrap.append(copyBox);

  block.replaceChildren(wrap);
}
