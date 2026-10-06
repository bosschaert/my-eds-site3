/*
 * Cases block — Garden Eight home case list (.Pb): the intro paragraph (the default content
 * right before the block, pulled into the intro slot as its wrapper), one marquee title per
 * authored case link (card-as-link: the authored anchor is unwrapped once its href is read,
 * the row's <p> becomes the first marquee copy, the further copies are presentational clones)
 * and the View Cases CTA (last row, moved as its <p>) over the drawn rule. Authored nodes are
 * moved with append(); words are wrapped by moving text nodes (Text.splitText), never from
 * textContent. decorate() is re-entrant (a decorated block is left as it is).
 *
 * @ew-exempt marquee repeats — the 2nd/3rd .mq-t copy of each title is an aria-hidden clone of
 *   the authored paragraph (EW4); the copy count is derived from the title length
 */
const EDITABLE = 'p, h1, h2, h3, h4, h5, h6, ul, ol, picture';

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

/**
 * Splits the text nodes under slot at whitespace and wraps each word in nested spans
 * (classes, outermost first), moving the word's text node into the innermost one.
 */
function wrapWords(slot, classes) {
  [...slot.childNodes].forEach((n) => {
    let node = n.nodeType === Node.TEXT_NODE ? n : null;
    while (node) {
      const m = node.data.match(/\S+/);
      if (!m) break;
      if (m.index > 0) {
        node = node.splitText(m.index);
      } else {
        const rest = node.data.length > m[0].length ? node.splitText(m[0].length) : null;
        const outer = el('span', classes[0]);
        const inner = classes.slice(1).reduce((parent, cls) => {
          const child = el('span', cls);
          parent.append(child);
          return child;
        }, outer);
        node.before(outer);
        inner.append(node);
        node = rest;
      }
    }
  });
}

/** Presentational clone hygiene (EW4): no ids, no editor instrumentation, hidden from AT. */
function stripInstrumentation(node) {
  [node, ...node.querySelectorAll('*')].forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (a.name === 'id' || /^data-(aue|richtext|prose|rt)/.test(a.name)) n.removeAttribute(a.name);
    });
  });
  node.setAttribute('aria-hidden', 'true');
}

/** Marquee copies of a title: enough display text to run ~2 viewports (captured 2 / 3 / 3). */
function copiesFor(text) {
  return Math.max(2, Math.ceil(24 / Math.max(text.trim().length, 1)));
}

/**
 * One case (.pickup-li > a.pickup-a > .cases-inf + .mq…): the row's <p> is the first marquee
 * copy, its anchor unwrapped after the href moved to the card link (EW6).
 * @param {Element} row the authored block row
 */
function buildCase(row) {
  const p = row.querySelector('p');
  if (!p) return null;
  const li = el('article', 'pickup-li');
  const a = el('a', 'pickup-a');
  const link = p.querySelector('a');
  if (link) {
    a.setAttribute('href', link.getAttribute('href') || '#');
    link.replaceWith(...link.childNodes);
  }
  // accessible name as on the source (aria-label on the card link), derived from the authored text
  const name = (p.textContent || '').replace(/\s+/g, ' ').trim();
  if (name) a.setAttribute('aria-label', name);
  const mq = el('div', 'mq pickup-h1 cases-h1 serif words');
  const anim = el('div', 'mq-anim');
  const ul = el('div', 'mq-ul');
  const item = el('div', 'mq-li h1');
  const first = el('div', 'mq-t');
  first.append(p);
  if (!p.querySelector('.l')) wrapWords(p, ['p o', 'w t', 'l']);
  item.append(first);
  const copies = copiesFor(p.textContent || '');
  for (let i = 1; i < copies; i += 1) {
    const clone = first.cloneNode(true);
    stripInstrumentation(clone);
    item.append(' ', clone);
  }
  ul.append(item);
  anim.append(ul);
  mq.append(anim);
  a.append(el('div', 'cases-inf'), mq);
  li.append(a);
  return li;
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
 * decorates the cases list
 * @param {Element} block The cases block element
 */
export default async function decorate(block) {
  if (block.querySelector('.pickup-ul')) {
    await reveal(block);
    return;
  }
  const rows = [...block.children];
  const ctaRow = rows.length > 1 ? rows[rows.length - 1] : null;
  const caseRows = ctaRow ? rows.slice(0, -1) : rows;

  // intro (.body.intro-body > .intro): the default content right before the block
  const introBody = el('div', 'cases-intro-body');
  const intro = el('div', 'cases-intro clip-y');
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    intro.append(prev);
    prev.querySelectorAll('p').forEach((p) => {
      if (p.querySelector('.t')) return;
      wrapLines(p, () => {
        const line = el('span', 'cases-intro-line');
        const slot = el('span', 't');
        line.append(slot);
        return { line, slot };
      });
    });
  }
  introBody.append(intro);

  // the list (.St-wrap > .St-flex > .St-center > .St-body.pickup-wrap > .pickup > .pickup-ul)
  const wrap = el('div', 'cases-wrap');
  const flex = el('div', 'cases-flex');
  const center = el('div', 'cases-center');
  const listBody = el('div', 'cases-body pickup-wrap');
  const pickup = el('div', 'pickup');
  const pickupUl = el('div', 'pickup-ul');
  caseRows.forEach((row) => {
    const li = buildCase(row);
    if (li) pickupUl.append(li);
  });
  pickup.append(pickupUl);
  listBody.append(pickup);
  center.append(listBody);

  // View Cases (.St-footer > .body > .hr + a.ui-link-hn): the CTA moves as its <p>
  const footer = el('div', 'cases-footer');
  const footerBody = el('div', 'cases-footer-body');
  const hr = el('div', 'hr');
  hr.append(el('div'));
  const view = el('div', 'cases-view ui-link-hn clip-y');
  if (ctaRow) {
    const p = ctaRow.querySelector('p');
    if (p) view.append(p);
  }
  footerBody.append(hr, view);
  footer.append(footerBody);
  flex.append(center, footer);
  wrap.append(flex);

  // leftovers: any other authored element keeps rendering, after the list
  listBody.append(...block.querySelectorAll(EDITABLE));

  block.replaceChildren(introBody, wrap);
  await reveal(block);
}
