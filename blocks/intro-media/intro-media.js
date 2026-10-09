/**
 * intro-media — the source's "en bref" intro: the `.text` module(s) of a therapy-area page's
 * brief section, with an optional media figure (a picture, or a video poster image linked to
 * its player page). Template-slotted (#95): empty slot wrappers, the authored nodes MOVED in
 * by role (EW1). Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-
 * herzinsuffizienz.json § brief (5 paragraphs + a 2-item list; the section's h2 title and
 * the social row are NOT rows of this block — the title is DEFAULT CONTENT at the top of the
 * section (D1), styled in place by this block's CSS, the icons are the social-features block).
 *
 * Authoring — ONE row, cells in any split (classified by content, never by index, #42):
 *   - optional picture (plain or linked): the media figure
 *   - the intro copy: <p> paragraphs and <ul>/<ol> lists (bold runs as <strong>, reference
 *     markers as <sup>)
 * @param {Element} block the block element
 */
function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

/** Every image of a text-less node, each moved with its wrapping link (a video poster links
 *  to its player page); a cell may hold two pictures in ONE <p> (#104). */
function mediaIn(node) {
  if (node.matches('picture, img')) return [node.closest('a') || node];
  return [...node.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')))
    .map((el) => el.closest('a') || el);
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

  const figure = slot('intro-figure');
  const body = slot('intro-body');
  nodes.forEach((node) => {
    const media = mediaIn(node);
    if (media.length && !node.textContent.trim()) {
      const img = slot('img');
      img.append(...media);
      figure.append(img);
    } else {
      body.append(node);
    }
  });

  const out = [];
  if (figure.firstElementChild) out.push(figure);
  if (body.firstElementChild) out.push(body);
  block.replaceChildren(...out);
}
