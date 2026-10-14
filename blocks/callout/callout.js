/**
 * callout — centred call-to-action band over a photo with a maroon wash
 * (prototype section.sm-callout; schema stardust/eds-schema/index.json section 5:
 * heading, body, body (opening hours), cta).
 *
 * Decode tier: template-slotted. Authored (any row/cell shape, DA-flattened ok):
 *   <img> (band photo, rendered as the background layer) · <h3> · body <p> ·
 *   opening-hours <p> (the LAST plain paragraph when there are two or more;
 *   the clock icon is CSS) · CTA <p><strong><a></a></strong></p>
 * Authored nodes are MOVED into the slots (EW1/EW3).
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

// Flat authored elements across every cell. A <p> that only wraps a picture
// yields the picture. HARNESS-ONLY fallback (EW5): a text-only cell is wrapped
// by MOVING its text nodes into a <p>.
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
  const texts = nodes.filter((n) => ![media, heading].includes(n) && !ctas.includes(n));
  const hours = texts.length > 1 ? texts.pop() : null;

  const copy = slot('callout-copy');
  if (heading) copy.append(slot('callout-heading', heading));
  if (texts.length) copy.append(slot('callout-text', ...texts));
  if (hours) copy.append(slot('callout-hours', hours));
  if (ctas.length) copy.append(slot('callout-actions', ...ctas));

  const parts = [];
  if (media) parts.push(slot('callout-bg', media));
  parts.push(slot('callout-inner', slot('callout-row', copy)));
  block.classList.add('js-show-on-scroll');
  block.replaceChildren(...parts);
}
