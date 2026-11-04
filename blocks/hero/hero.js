/*
 * Hero (courtyard) — template-slotted. Authored rows: [1] <h1> (visually hidden), [2] desktop
 * image, [3] mobile image. decorate() builds EMPTY slot wrappers carrying the prototype's class
 * names and MOVES the authored nodes into them (EW1); nothing is rebuilt from text. Nodes are
 * picked by role (heading, media in authored order), never by row index. Any authored element no
 * slot consumed lands in `.hero-extra` so content never silently vanishes.
 */

/* every authored element across cells; #104: a picture-led cell folded into one <p> is expanded */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    out.push(...kids);
  });
  return out;
}

function slot(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}

/* the moveable media unit: a <picture>, or a bare <img> outside any <picture> */
function mediaOf(el) {
  if (el.matches('picture')) return el;
  if (el.matches('img')) return el.closest('picture') || el;
  return el.querySelector('picture') || el.querySelector('img');
}

function hasContent(el) {
  return !!(el.textContent.trim() || el.querySelector('picture, img'));
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  const medias = [];
  nodes.forEach((n) => {
    const m = mediaOf(n);
    if (m && !medias.includes(m)) medias.push(m);
  });

  const title = slot('hero-title sr-only');
  if (heading) title.append(heading);

  const desktop = slot('hero-desktop');
  const mobile = slot('hero-mobile');
  medias.forEach((m, i) => {
    const img = m.matches('img') ? m : m.querySelector('img');
    if (i === 0) {
      desktop.append(m);
      if (img) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
    } else {
      mobile.append(m);
      if (img) img.setAttribute('loading', 'lazy');
    }
  });

  const extra = slot('hero-extra');
  nodes.forEach((n) => {
    if (n.isConnected && block.contains(n) && hasContent(n)) extra.append(n);
  });

  const out = [title, desktop];
  if (mobile.childElementCount) out.push(mobile);
  if (extra.childElementCount) out.push(extra);
  block.replaceChildren(...out);
}
