/*
 * Host — template-slotted. Authored rows: [1] <h2> + intro <p>; [2] cell 1 = paragraphs,
 * cell 2 = portrait image. decorate() builds EMPTY wrappers with the prototype's class names
 * (`host-head`, `host-figure` > `host-note` + `host-img`) and MOVES the authored nodes into them
 * (EW1): the cell holding the heading is the head (heading + its intro paragraph), media goes to
 * the figure image, every other authored element to the note. No row indices, no rebuilt text.
 */

function cellsOf(block) {
  return [...block.querySelectorAll(':scope > div > div')].map((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    return kids;
  });
}

function slot(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}

function mediaOf(el) {
  if (el.matches('picture')) return el;
  if (el.matches('img')) return el.closest('picture') || el;
  return el.querySelector('picture') || el.querySelector('img');
}

export default function decorate(block) {
  const cells = cellsOf(block);
  const head = slot('host-head');
  const figure = slot('host-figure');
  const note = slot('host-note');
  const image = slot('host-img');

  const headCell = cells.find((kids) => kids.some((k) => k.matches('h1, h2, h3, h4, h5, h6')));
  cells.forEach((kids) => {
    kids.forEach((k) => {
      const media = mediaOf(k);
      if (media) {
        image.append(media);
        if (k !== media && k.textContent.trim()) note.append(k);
      } else if (kids === headCell) {
        head.append(k);
      } else if (k.textContent.trim()) {
        note.append(k);
      }
    });
  });

  if (note.childElementCount) figure.append(note);
  if (image.childElementCount) figure.append(image);
  const out = [];
  if (head.childElementCount) out.push(head);
  if (figure.childElementCount) out.push(figure);
  block.replaceChildren(...out);
}
