/**
 * Departure — "Before you go" (source `section.departure`, stardust:replica of
 * www.niravmanubhai.com). Decode tier: TEMPLATE-SLOTTED. Schema:
 * stardust/eds-schema/index.json → section "departure" (heading, eyebrow, 5 body, 2 cta, image).
 *
 * Authoring (flat cell, schema order):
 *   1. <h2> section heading (visually hidden, labels the region — as in the source)
 *   2. <p> eyebrow                 5. <p> blessing ("Come, Again.")
 *   3. <p> note                    6. <p> Gujarati blessing (detected by script, else 5th)
 *   4. <p> doors-open line         7. <p><a>…</a></p> — the underlined text CTA
 *   8. <p> "…now" paragraph with an inline link
 *   9. image — the farewell portrait
 *   10. <p> thanks caption (any text after the image)
 *
 * All authored nodes are MOVED (EW1): heading → `.departure-heading` (sr-only); text before the
 * image → the copy column in role wrappers (`.eyebrow`, `.departure-note`, `.departure-open`,
 * `.blessing`, `.guj-blessing`, `.departure-cta` for a paragraph that is only a link,
 * `.departure-now` for a paragraph with an inline link); picture + text after it →
 * `.departure-portrait`. Surplus paragraphs stay visible in `.departure-extra`. Re-entrant.
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

const GUJARATI = /[\u0A80-\u0AFF]/;

/** A paragraph whose whole text is its link (read-only decision, EW1). */
function isLinkOnly(p) {
  const a = p.querySelector('a');
  return !!a && p.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .wrap')) return;
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3'));
  const mediaNode = nodes.find((n) => mediaOf(n));
  const media = mediaNode ? mediaOf(mediaNode) : null;
  const mediaIndex = mediaNode ? nodes.indexOf(mediaNode) : nodes.length;
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && n.textContent.trim());
  const before = texts.filter((n) => nodes.indexOf(n) < mediaIndex);
  const after = texts.filter((n) => nodes.indexOf(n) > mediaIndex);

  const ctas = before.filter((p) => isLinkOnly(p));
  const mixed = before.filter((p) => !ctas.includes(p) && p.querySelector('a'));
  const plain = before.filter((p) => !ctas.includes(p) && !mixed.includes(p));
  const guj = plain.find((p) => GUJARATI.test(p.textContent));
  const ordered = plain.filter((p) => p !== guj);
  const [eyebrow, note, open, blessing, ...extra] = ordered;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const copy = document.createElement('div');
  copy.className = 'departure-copy';
  if (eyebrow) copy.append(wrapNode(eyebrow, 'eyebrow'));
  if (note) copy.append(wrapNode(note, 'departure-note'));
  if (open) copy.append(wrapNode(open, 'departure-open'));
  if (blessing) copy.append(wrapNode(blessing, 'blessing'));
  if (guj) copy.append(wrapNode(guj, 'guj-blessing'));
  ctas.forEach((p) => copy.append(wrapNode(p, 'departure-cta')));
  mixed.forEach((p) => copy.append(wrapNode(p, 'departure-now')));
  extra.forEach((p) => copy.append(wrapNode(p, 'departure-extra')));
  wrap.append(copy);

  if (media || after.length) {
    const portrait = document.createElement('div');
    portrait.className = 'departure-portrait';
    if (media) portrait.append(media);
    after.forEach((p) => portrait.append(wrapNode(p, 'departure-thanks')));
    wrap.append(portrait);
  }

  const out = [];
  if (heading) {
    const hidden = wrapNode(heading, 'departure-heading');
    if (!heading.id) heading.id = 'departure-heading';
    block.setAttribute('aria-labelledby', heading.id);
    out.push(hidden);
  }
  out.push(wrap);
  block.replaceChildren(...out);
}
