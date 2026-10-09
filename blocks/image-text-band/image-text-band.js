/**
 * image-text-band — the source's content bands: a `.teaser--text-left` (image on one side,
 * h4 title + copy on the other; stacked image-first below 768px) followed by zero or more
 * full-width `.text` modules. Reconstructive (#95): ONE block instance per band, its rows
 * classified by content — authors add or remove the trailing text modules. Schema:
 * stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-herzinsuffizienz.json § band
 * (×3: 2 images, 1 title, copy, 0–1 trailing text).
 *
 * Authoring — the TEASER row (the first row holding a picture or a heading), cells in any
 * split (never read by index, #42):
 *   - picture(s): the DESKTOP image first, the MOBILE image (< 768px) second (optional)
 *   - the band title as <h4> (or h2/h3; plain or linked), then the copy: <p> paragraphs /
 *     lists, and an optional CTA as <p><strong><a>…</a></strong></p> (a.button.primary before
 *     decorate runs — the <p> moves into the action slot pinned to the bottom, EW3)
 *   every OTHER row = one full-width text module (paragraphs / lists), rendered below the
 *   teaser (rows authored above it render above it).
 * Variants (block classes, 1:1 with the source's container / teaser modifiers):
 *   text-image        image RIGHT of the copy from 768px (default: image left)
 *   text-left         copy left-aligned, shrink-to-fit rows (teaser--text-left)
 *   space             band padding 20px at every width (container--tb-space)
 *   text-space        the first trailing text module keeps its canon top margin 10/16px
 *                     (source .text.text--b-space-0 right after the teaser); consecutive
 *                     text modules always keep one collapsed canon margin between them
 *   space-md          band padding 20px, 40px from 768px (container--tb-space-md)
 *   space-desktop-md  band padding 40px from 768px only (container--desktop-tb-space-md)
 *   space-desktop     band padding 20px from 768px only (container--desktop-tb-space)
 * @param {Element} block the block element
 */
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

/** Every image of a text-less node, each moved with its wrapping link when the source links
 *  the image; a cell may hold two pictures in ONE <p> (#104). */
function mediaIn(node) {
  if (node.matches('picture, img')) return [node.closest('a') || node];
  return [...node.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')))
    .map((el) => el.closest('a') || el);
}

/** Flat authored nodes of a row (cell children; a bare-text cell becomes a <p>, EW5). */
function rowNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function isMedia(node) {
  return mediaIn(node).length > 0 && !node.textContent.trim();
}

function isCta(node) {
  return node.tagName === 'P' && !!node.querySelector('a.button, strong > a, em > a')
    && node.textContent.trim() === (node.querySelector('a') || node).textContent.trim();
}

function buildTeaser(nodes) {
  const teaser = slot('band-teaser');
  const media = slot('band-media');
  const body = slot('band-body');
  const pics = [];
  let heading = null;
  const copy = [];
  const ctas = [];
  nodes.forEach((node) => {
    if (isMedia(node)) pics.push(...mediaIn(node));
    else if (!heading && node.matches(HEADINGS)) heading = node;
    else if (isCta(node)) ctas.push(node);
    else copy.push(node);
  });
  const [desktopPic, mobilePic] = pics;
  if (desktopPic) {
    const d = slot('band-media-desktop');
    const img = slot('img');
    img.append(desktopPic);
    d.append(img);
    media.append(d);
  }
  if (mobilePic) {
    const m = slot('band-media-mobile');
    const img = slot('img');
    img.append(mobilePic);
    m.append(img);
    media.append(m);
  } else if (desktopPic) {
    media.classList.add('band-media-single');
  }
  if (heading) {
    const title = slot('band-title');
    title.append(heading);
    body.append(title);
  }
  if (copy.length) {
    const desc = slot('band-desc');
    desc.append(...copy);
    body.append(desc);
  }
  if (ctas.length) {
    const action = slot('band-action');
    action.append(...ctas);
    body.append(action);
  }
  if (media.firstElementChild) teaser.append(media);
  if (body.firstElementChild) teaser.append(body);
  return teaser;
}

export default async function decorate(block) {
  const rows = [...block.children].map(rowNodes).filter((nodes) => nodes.length);
  const teaserIndex = rows.findIndex((nodes) => nodes.some(
    (node) => isMedia(node) || node.matches(HEADINGS),
  ));
  const out = [];
  rows.forEach((nodes, i) => {
    if (i === teaserIndex) {
      out.push(buildTeaser(nodes));
      return;
    }
    const text = slot('band-text');
    text.append(...nodes);
    out.push(text);
  });
  block.replaceChildren(...out);
}
