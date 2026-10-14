/**
 * books — the bookshelf door of #rooms (.r24-books): image | linked h3, line, free note.
 * Schema: stardust/eds-schema/index.json sections[3] (rooms). Decode tier: template-slotted.
 *
 * Authoring row: image | h3 (linked) + paragraph + free-books paragraph.
 * EW6: the authored anchor inside the title is unwrapped after its href moves to the card.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const picture = media ? media.closest('picture') || media : null;
  const heading = block.querySelector('h1, h2, h3, h4');
  const link = block.querySelector('a[href]');
  const paragraphs = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));

  const door = document.createElement(link ? 'a' : 'div');
  door.className = 'books-door';
  if (link) door.href = link.href;
  if (picture) door.append(wrapNode(picture, 'books-media'));
  const copy = document.createElement('div');
  copy.className = 'books-copy';
  if (heading) copy.append(wrapNode(heading, 'books-title'));
  paragraphs.forEach((p, i) => {
    const last = i === paragraphs.length - 1 && paragraphs.length > 1;
    copy.append(wrapNode(p, last ? 'books-free' : 'books-line'));
  });
  if (copy.childElementCount) door.append(copy);
  if (link) door.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
  block.replaceChildren(door);
}
