/*
 * Hero block — Garden Eight home hero (.Ph): the lead paragraph pinned top-left of the
 * section (.description, clip-y line reveal) and the display title (.site-title / .page-title
 * in gunsan, one line per authored hard break, words as inline-block .w.t). Template-slotted:
 * the authored <p> and <h1> are MOVED into the template with append(); the line and word
 * wrappers are built by moving the authored text nodes (Text.splitText for the words), never
 * from textContent. The authored <br> stay in place (hidden by CSS). decorate() is re-entrant.
 */
const LINE_HOOKS = ['what', 'canwe', 'make', 'next'];

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/** The runs of child nodes between the authored <br> of node (whitespace-only runs skipped). */
function textRuns(node) {
  const runs = [[]];
  [...node.childNodes].forEach((n) => {
    if (n.nodeName === 'BR') runs.push([]);
    else runs[runs.length - 1].push(n);
  });
  return runs.filter((run) => run.some((n) => n.nodeType !== Node.TEXT_NODE || n.data.trim()));
}

/**
 * Wraps every text run of node: build(i) returns { line, slot }; the line wrapper takes the
 * run's place and the run's nodes move into the slot.
 */
function wrapLines(node, build) {
  textRuns(node).forEach((run, i) => {
    const { line, slot } = build(i);
    run[0].before(line);
    slot.append(...run);
  });
}

/** Splits the text nodes under slot at whitespace and wraps each word in a span.w.t (moved). */
function wrapWords(slot) {
  [...slot.childNodes].forEach((n) => {
    let node = n.nodeType === Node.TEXT_NODE ? n : null;
    while (node) {
      const m = node.data.match(/\S+/);
      if (!m) break;
      if (m.index > 0) {
        node = node.splitText(m.index);
      } else {
        const rest = node.data.length > m[0].length ? node.splitText(m[0].length) : null;
        const word = el('span', 'w t');
        node.before(word);
        word.append(node);
        node = rest;
      }
    }
  });
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
 * decorates the hero
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  const lead = block.querySelector('p');
  const title = block.querySelector('h1');

  // lead (.description): one clip-y line per authored hard break
  const leadWrap = el('div', 'hero-lead op');
  if (lead) {
    leadWrap.append(lead);
    if (!lead.querySelector('.t')) {
      wrapLines(lead, () => {
        const line = el('span', 'o clip-y');
        const slot = el('span', 't');
        line.append(slot);
        return { line, slot };
      });
    }
  }

  // title (.site-title > .h1 > .page-title): one .p.o line per hard break, words as .w.t
  const body = el('div', 'hero-body');
  const titleWrap = el('div', 'hero-title');
  const h1Wrap = el('div', 'hero-h1');
  const pageTitle = el('div', 'hero-page-title words serif');
  if (title) {
    pageTitle.append(title);
    if (!title.querySelector('.t')) {
      wrapLines(title, (i) => {
        const line = el('span', 'p o');
        if (LINE_HOOKS[i]) line.dataset.str = LINE_HOOKS[i];
        return { line, slot: line };
      });
      title.querySelectorAll('.p').forEach((line) => wrapWords(line));
    }
  }
  h1Wrap.append(pageTitle);
  titleWrap.append(h1Wrap);
  body.append(titleWrap);

  // leftovers: any other authored element keeps rendering, after the title
  body.append(...block.querySelectorAll('p, h2, h3, h4, h5, h6, ul, ol, picture'));

  block.replaceChildren(leadWrap, body);
  await reveal(block);
}
