/**
 * split-teaser — the source's `.teaser--text-image` (copy + primary CTA left, image right;
 * stacked image-first below 768px). Reconstructive (#95): classified by content, one block
 * instance per band. Schema: stardust/eds-schema/fr-startseite.json § products (2 images,
 * 2 texts, 1 CTA).
 *
 * Authoring — rows/cells in any split (never read by index, #42):
 *   - picture: the DESKTOP image; a second picture = the MOBILE image (< 768px), optionally
 *     wrapped in a link (the source links the mobile image) — the link moves with it
 *   - text: optional heading, copy paragraphs / lists, the CTA as <p><strong><a>…</a></strong></p>
 *     (decorateButtons makes it a.button.primary before this runs — the <p> MOVES, EW3)
 * The band title above it is DEFAULT CONTENT in the same section (styled in place by CSS).
 * @param {Element} block the block element
 */
function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

/** Every image of a text-less node, each moved with its wrapping link (the source links
 *  the mobile image); a cell may hold two pictures in ONE <p> (#104). */
function mediaIn(node) {
  if (node.matches('picture, img')) return [node.closest('a') || node];
  return [...node.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')))
    .map((el) => el.closest('a') || el);
}

function isCta(el) {
  return el.tagName === 'P' && !!el.querySelector('a.button, strong > a, em > a')
    && el.textContent.trim() === (el.querySelector('a') || el).textContent.trim();
}

export default async function decorate(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) nodes.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): bare-text cell — move the text node into a <p>, never copy it
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    }
  });

  const pics = [];
  let heading = null;
  const copy = [];
  const ctas = [];
  nodes.forEach((node) => {
    const media = mediaIn(node);
    if (media.length && !node.textContent.trim()) {
      pics.push(...media);
    } else if (!heading && node.matches('h1, h2, h3, h4, h5, h6')) {
      heading = node;
    } else if (isCta(node)) {
      ctas.push(node);
    } else {
      copy.push(node);
    }
  });

  const inner = slot('split-inner');
  const media = slot('split-media');
  const content = slot('split-content');
  const [desktopPic, mobilePic] = pics;
  if (desktopPic) {
    const d = slot('split-media-desktop');
    const img = slot('img');
    img.append(desktopPic);
    d.append(img);
    media.append(d);
  }
  if (mobilePic) {
    const m = slot('split-media-mobile');
    const img = slot('img');
    img.append(mobilePic);
    m.append(img);
    media.append(m);
  } else if (desktopPic) {
    media.classList.add('split-media-single');
  }
  if (heading) {
    const title = slot('split-title');
    title.append(heading);
    content.append(title);
  }
  if (copy.length) {
    const desc = slot('split-desc');
    desc.append(...copy);
    content.append(desc);
  }
  if (ctas.length) {
    const action = slot('split-action');
    action.append(...ctas);
    content.append(action);
  }
  if (media.firstElementChild) inner.append(media);
  if (content.firstElementChild) inner.append(content);
  block.replaceChildren(inner);
}
