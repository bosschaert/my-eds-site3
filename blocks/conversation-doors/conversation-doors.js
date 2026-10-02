/**
 * Conversation doors — the sitting room (source `section.room-section.alt#conversation`,
 * stardust:replica of www.niravmanubhai.com). Decode tier: RECONSTRUCTIVE (the door links are
 * a repeat group). Schema: stardust/eds-schema/index.json → section "room-section" #3
 * (eyebrow, heading, 4 body, 6 cta doors, follow: eyebrow + body + 1 cta).
 *
 * Authoring (flat cell, schema order):
 *   1. image — the sitting-room photograph
 *   2. <p> eyebrow                 3. <h2> title
 *   4..n <p> lede paragraphs
 *   then one <p><em><a>…</a></em></p> per door (outline buttons; any number of them)
 *   then the "Follow the House" group: <p> eyebrow, <p> body, <p><strong><a>…</a></strong></p>
 *
 * Segmentation is ORDER-driven, not class-driven (button classes die in the workspace):
 * link-free text before the heading = eyebrow; after it, link-free text = lede until the first
 * link paragraph; consecutive link paragraphs = the doors; any text after the doors opens the
 * follow group (first text = its eyebrow, the rest its body, its link paragraphs its CTA).
 * Every authored node is MOVED (EW1, CTAs as their paragraph, EW3). External links get
 * `target="_blank" rel="noopener noreferrer"` and the mailto door an aria-label, as on the
 * source page (attributes only — no authored text is touched). Re-entrant (EW9).
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

/** Mirror the source page's link attributes (aria-label on the mail door, new tab elsewhere). */
function decorateDoorLinks(container) {
  container.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('mailto:')) {
      if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', 'Send email');
      return;
    }
    let external = false;
    try {
      const url = new URL(href, window.location.href);
      external = /^https?:$/.test(url.protocol) && url.host !== window.location.host;
    } catch (e) {
      external = false;
    }
    if (external) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .wrap')) return;
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3'));
  const media = nodes.map((n) => mediaOf(n)).find(Boolean);
  const headingIndex = heading ? nodes.indexOf(heading) : -1;
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && n.textContent.trim());

  const eyebrows = [];
  const ledes = [];
  const doors = [];
  const followTexts = [];
  const followCtas = [];
  let phase = 'lede';
  texts.forEach((n) => {
    const link = hasLink(n);
    if (nodes.indexOf(n) < headingIndex && !link) {
      eyebrows.push(n);
      return;
    }
    if (phase === 'lede') {
      if (link) {
        phase = 'doors';
        doors.push(n);
      } else ledes.push(n);
      return;
    }
    if (phase === 'doors') {
      if (link) {
        doors.push(n);
        return;
      }
      phase = 'follow';
    }
    if (link) followCtas.push(n);
    else followTexts.push(n);
  });

  const section = block.closest('.section');
  if (section && !section.id) section.id = section.dataset.id || 'conversation';

  const wrap = document.createElement('div');
  wrap.className = 'wrap split';
  if (media) wrap.append(wrapNode(media, 'visual house-section-media conversation-room-media'));

  const copy = document.createElement('div');
  copy.className = 'conversation-copy';
  eyebrows.forEach((p) => copy.append(wrapNode(p, 'eyebrow conversation-eyebrow')));
  if (heading) copy.append(wrapNode(heading, 'conversation-heading'));
  ledes.forEach((p) => copy.append(wrapNode(p, 'lede')));
  if (doors.length) {
    const box = document.createElement('div');
    box.className = 'doors';
    box.append(...doors);
    decorateDoorLinks(box);
    copy.append(box);
  }
  if (followTexts.length || followCtas.length) {
    const follow = document.createElement('div');
    follow.className = 'r24-follow';
    const [followEyebrow, ...followBody] = followTexts;
    if (followEyebrow) follow.append(wrapNode(followEyebrow, 'r24-follow-eyebrow'));
    follow.append(...followBody);
    followCtas.forEach((p) => follow.append(wrapNode(p, 'r24-follow-cta')));
    decorateDoorLinks(follow);
    copy.append(follow);
  }
  wrap.append(copy);

  block.replaceChildren(wrap);
}
