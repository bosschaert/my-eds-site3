/**
 * rooms-also — "Also in the House" of #rooms (.r24-also): a centred eyebrow and three linked
 * line items (title → line), the third with an image.
 * Schema: stardust/eds-schema/index.json sections[3] repeats[1] (3 units, uniform: false —
 * the image-less and the image-bearing item are both reproduced).
 * Decode tier: reconstructive — classified by content: a row without a link is the eyebrow,
 * every row with a link is one item.
 *
 * Authoring rows: eyebrow paragraph; then per item: [image] | linked title paragraph + line.
 * EW6: the authored anchor inside the title is unwrapped after its href moves to the item.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function buildItem(row, link) {
  const media = row.querySelector('picture, img');
  const picture = media ? media.closest('picture') || media : null;
  const paragraphs = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const item = document.createElement('a');
  item.className = 'also-item';
  item.href = link.href;
  if (picture) item.append(wrapNode(picture, 'also-media'));
  paragraphs.forEach((p) => {
    item.append(wrapNode(p, p.contains(link) ? 'also-title' : 'also-line'));
  });
  item.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  const frag = document.createDocumentFragment();
  const grid = document.createElement('div');
  grid.className = 'also-grid';
  rows.forEach((row) => {
    const link = row.querySelector('a[href]');
    if (link) {
      grid.append(buildItem(row, link));
      return;
    }
    [...row.querySelectorAll('p, h2, h3, h4')].forEach((el) => {
      frag.append(wrapNode(el, 'also-eyebrow'));
    });
  });
  if (grid.childElementCount) frag.append(grid);
  block.replaceChildren(frag);
}
