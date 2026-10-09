/**
 * references — the source's references foot: small-type `.text--small` modules — abbreviation
 * notes, the bold "Références:" label and the numbered <ol> of citations. Reconstructive
 * (#95): every authored node is classified by content (never by index, #42) and MOVED into
 * its own text module (EW1):
 *   <ol> / <ul>            → .ref-list   (the citations)
 *   a fully bold <p>       → .ref-label  (the label line: canon .text margins 10/16px)
 *   any other node         → .ref-note   (abbreviations, footnotes: flush .text--b/t-space-0)
 * Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-herzinsuffizienz.json
 * § references (3 text modules; the count varies per page).
 *
 * Authoring — any number of rows / cells; authors add, remove or reorder notes, labels
 * and lists (bold runs as <strong>, reference markers as <sup>). Spacing rides the ROWS:
 * nodes inside one row are flush, every further row opens a module with the canon .text
 * margin (10px, 16px from 768px — `.ref-row-start`); a bold label keeps its own margins.
 * Variant `space-bottom`: the last module keeps its canon bottom margin.
 * @param {Element} block the block element
 */
function isLabel(node) {
  if (node.tagName !== 'P') return false;
  const bold = node.querySelector('strong, b');
  return !!bold && bold.textContent.trim() === node.textContent.trim();
}

function classify(node) {
  if (node.matches('ol, ul')) return 'ref-list';
  if (isLabel(node)) return 'ref-label';
  return 'ref-note';
}

export default async function decorate(block) {
  const modules = [];
  [...block.children].forEach((row, rowIndex) => {
    let rowStart = rowIndex > 0;
    row.querySelectorAll(':scope > div').forEach((cell) => {
      const nodes = [...cell.children];
      if (!nodes.length && cell.textContent.trim()) {
        // harness-only (EW5): bare-text cell — move the text node into a <p>, never copy it
        const p = document.createElement('p');
        p.append(...cell.childNodes);
        nodes.push(p);
      }
      nodes.forEach((node) => {
        const wrap = document.createElement('div');
        wrap.className = classify(node);
        // every authored row after the first opens a spaced module (canon .text margins)
        if (rowStart) wrap.classList.add('ref-row-start');
        rowStart = false;
        wrap.append(node);
        modules.push(wrap);
      });
    });
  });
  block.replaceChildren(...modules);
}
