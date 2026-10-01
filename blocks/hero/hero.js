/**
 * Hero — the courtyard (source `section.hero#courtyard`, stardust:replica of
 * www.niravmanubhai.com). Decode tier: TEMPLATE-SLOTTED. Schema:
 * stardust/eds-schema/index.json → section "hero" (1 heading, 1 image).
 *
 * Authoring (one cell per row, or everything in one cell — both shapes decode):
 *   - <h1> — the page's single heading; visually hidden as in the source
 *   - first image — the wide courtyard photograph (1200×675)
 *   - optional second image — the mobile crop, shown at widths ≤ 640px
 *
 * The authored nodes are MOVED into the template (EW1): the <h1> into `.hero-title`
 * (sr-only), the wide picture into `.hero-media`. When a second image is authored, its
 * URL becomes a `<source media="(max-width: 640px)">` on the wide picture (the source
 * page's `<picture>` swaps crops there) and the authored element itself is kept in the
 * hidden `.hero-media-narrow` slot so it stays editable in the workspace.
 * Re-entrant: a decorated block is left untouched (EW9).
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

function imgSrc(media) {
  const img = media.matches('img') ? media : media.querySelector('img');
  return img ? img.getAttribute('src') : '';
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-media')) return;
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const medias = nodes.filter((n) => mediaOf(n)).map((n) => mediaOf(n));
  const [wide, narrow] = medias;

  const section = block.closest('.section');
  if (section && !section.id) section.id = section.dataset.id || 'courtyard';
  // the source section is a labelled region (<section aria-label="Courtyard">); the label is
  // authored as section metadata (`aria-label`) and read back from the data attribute
  if (section && section.dataset.ariaLabel && !section.hasAttribute('aria-label')) {
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', section.dataset.ariaLabel);
  }

  const out = [];
  if (heading) {
    const h = heading.matches('h1, h2, h3') ? heading : heading.querySelector('h1, h2, h3');
    out.push(wrapNode(h, 'hero-title'));
  }
  if (wide) {
    let picture = wide;
    if (wide.matches('img')) {
      picture = document.createElement('picture');
      picture.append(wide);
    }
    const img = picture.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('decoding', 'async');
    }
    if (narrow) {
      const src = imgSrc(narrow);
      if (src) {
        const source = document.createElement('source');
        source.setAttribute('media', '(max-width: 640px)');
        source.setAttribute('srcset', src);
        picture.prepend(source);
      }
    }
    out.push(wrapNode(picture, 'hero-media'));
    if (narrow) {
      const hidden = wrapNode(narrow, 'hero-media-narrow');
      hidden.setAttribute('aria-hidden', 'true');
      const narrowImg = narrow.matches('img') ? narrow : narrow.querySelector('img');
      if (narrowImg) narrowImg.setAttribute('loading', 'lazy');
      out.push(hidden);
    }
  }
  // leftovers: anything authored beyond the template still renders (never dropped)
  nodes.forEach((n) => {
    const consumed = out.some((w) => w.contains(n));
    if (!consumed && (n.textContent.trim() || n.querySelector(MEDIA))) {
      out.push(wrapNode(n, 'hero-extra'));
    }
  });
  block.replaceChildren(...out);
}
