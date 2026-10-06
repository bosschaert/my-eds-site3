/*
 * About teaser block — Garden Eight home closing band (.Pf, above the relocated footer bar):
 * the TOP link (.ui-top, desktop only), the full-stage about link (.a-mask, visually hidden
 * text), the editor paragraph (.editor.js-iv-c, fades in) and the ABOUT US link with its ball
 * (.ui-link-wrap). Template-slotted by row order: TOP / About / paragraph / ABOUT US; every
 * authored p/a is MOVED with append() and styled through wrapper selectors. decorate() is
 * re-entrant (a decorated block is left as it is).
 */
function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/** The authored elements of row i (its single cell), or []. */
function cellNodes(rows, i) {
  const row = rows[i];
  if (!row) return [];
  return [...(row.firstElementChild || row).children];
}

/** Observes the reveal targets through the shared motion layer (absent on a static harness). */
async function reveal(block) {
  try {
    const { observeReveals } = await import('../../scripts/motion.js');
    observeReveals(block);
  } catch {
    // no motion layer: the end states are static
  }
}

/**
 * decorates the about teaser
 * @param {Element} block The about-teaser block element
 */
export default async function decorate(block) {
  if (block.querySelector('.about-teaser-stage')) {
    await reveal(block);
    return;
  }
  const rows = [...block.children];

  // stage (.body > .Pf-body): TOP link top-right, the about mask over the whole stage
  const body = el('div', 'about-teaser-body');
  const stage = el('div', 'about-teaser-stage');
  const top = el('div', 'about-teaser-top hide-m tx-r lh-r');
  top.append(...cellNodes(rows, 0));
  const mask = el('div', 'about-teaser-mask');
  mask.append(...cellNodes(rows, 1));
  // the mask link's text is visually hidden; its accessible name is carried as on the source
  const maskLink = mask.querySelector('a');
  if (maskLink) {
    const name = (maskLink.textContent || '').replace(/\s+/g, ' ').trim();
    if (name) maskLink.setAttribute('aria-label', name);
  }
  stage.append(top, mask);
  body.append(stage);

  // footer (.Pf-footer > .body): two columns, the text and the ABOUT US link in the second
  const footer = el('div', 'about-teaser-footer');
  const footerBody = el('div', 'about-teaser-footer-body');
  const cols = el('div', 'about-teaser-cols');
  const colLeft = el('div', 'about-teaser-col');
  const colRight = el('div', 'about-teaser-col');
  const editor = el('div', 'editor js-iv-c');
  editor.append(...cellNodes(rows, 2));
  const link = el('div', 'about-teaser-link');
  const linkNodes = cellNodes(rows, 3);
  if (linkNodes.length) link.append(...linkNodes, el('span', 'ball'));
  colRight.append(editor, link);
  cols.append(colLeft, colRight);
  const hr = el('div', 'hr hide-m');
  hr.append(el('div'));
  footerBody.append(cols, hr);
  footer.append(footerBody);

  // leftovers: further authored rows keep rendering, after the paragraph
  rows.slice(4).forEach((row, i) => editor.append(...cellNodes(rows, i + 4)));

  block.replaceChildren(body, footer);
  await reveal(block);
}
