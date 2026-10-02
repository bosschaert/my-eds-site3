/**
 * Bouquet feature — "Some stories are meant to be sent." (source
 * `section.room-section.r24-bouquet#story-bouquet-home`, stardust:replica of
 * www.niravmanubhai.com). Decode tier: TEMPLATE-SLOTTED. Schema:
 * stardust/eds-schema/index.json → section "room-section" #2 (eyebrow, heading, body, cta).
 *
 * Authoring (flat cell, schema order):
 *   1. image — the bouquet photograph (3:2 frame)
 *   2. <p> eyebrow
 *   3. <h2> title
 *   4..n <p> lede paragraph(s)
 *   last <p><strong><a>…</a></strong></p> — the solid CTA (decorateButtons → a.button.primary)
 *
 * All authored nodes are MOVED (EW1): picture → `.visual.house-section-media`; eyebrow (text
 * BEFORE the heading) → `.bouquet-eyebrow`; heading → `.bouquet-heading`; link-free text after
 * the heading → `.lede`; CTA paragraphs (moved whole, EW3) → `.bouquet-cta`. Re-entrant (EW9).
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
  if (block.querySelector(':scope > .wrap')) return;
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3'));
  const media = nodes.map((n) => mediaOf(n)).find(Boolean);
  const headingIndex = heading ? nodes.indexOf(heading) : -1;
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && n.textContent.trim());
  const ctas = texts.filter((n) => hasLink(n));
  const eyebrows = texts.filter((n) => !ctas.includes(n) && nodes.indexOf(n) < headingIndex);
  const ledes = texts.filter((n) => !ctas.includes(n) && !eyebrows.includes(n));

  const section = block.closest('.section');
  if (section && !section.id) section.id = section.dataset.id || 'story-bouquet-home';

  const wrap = document.createElement('div');
  wrap.className = 'wrap split';
  if (media) wrap.append(wrapNode(media, 'visual house-section-media'));

  const copy = document.createElement('div');
  copy.className = 'bouquet-copy';
  eyebrows.forEach((p) => copy.append(wrapNode(p, 'eyebrow bouquet-eyebrow')));
  if (heading) copy.append(wrapNode(heading, 'bouquet-heading'));
  ledes.forEach((p) => copy.append(wrapNode(p, 'lede')));
  ctas.forEach((p) => copy.append(wrapNode(p, 'bouquet-cta')));
  wrap.append(copy);

  block.replaceChildren(wrap);
}
