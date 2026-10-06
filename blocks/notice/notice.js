/**
 * Notice block — the single centered notice of the landing archetype
 * (https://www.example.com/): an optional visually hidden title, an icon,
 * one or more body paragraphs and a bare "Learn more" link.
 *
 * Rows are classified by CONTENT, never by position, so authors may omit,
 * add or reorder rows in Experience Workspace:
 *   - a row holding a heading (h1–h6)          → div.notice-title
 *   - a row holding .icon / picture / img      → div.notice-icon
 *   - a row whose only element is a link       → div.notice-cta
 *     (<p><a></p> as authored, or the bare <a> the pipeline delivers once it
 *     unwraps a cell's single paragraph)
 *   - anything else                            → div.notice-body
 *     (consecutive body rows share one wrapper)
 * Published pages arrive without the <p> around a cell's single paragraph
 * (the pipeline unwraps it); the classifier reads the same either way.
 * The authored elements are MOVED into the wrappers (no rebuild, no clone,
 * no retag, no classes added to h1/p/a/span.icon) and the emptied row and
 * cell divs are removed. Decorating an already decorated block is a no-op.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';
const ICON = '.icon, picture, img';

/**
 * Lists the element children of every cell of a row.
 * @param {Element} row The authored row (a direct child div of the block)
 * @returns {Element[]} The authored elements, in document order
 */
function rowElements(row) {
  const elements = [];
  [...row.children].forEach((cell) => {
    elements.push(...cell.children);
  });
  return elements;
}

/**
 * Tells whether a row is a call to action: its only element is a single <a>,
 * bare or wrapped in a <p>, and nothing else.
 * @param {Element} row The authored row
 * @returns {boolean} True for a CTA row
 */
function isCtaRow(row) {
  const elements = rowElements(row);
  if (elements.length !== 1) return false;
  const [only] = elements;
  if (only.tagName === 'A') return true;
  if (only.tagName !== 'P') return false;
  if (only.children.length !== 1) return false;
  const [a] = only.children;
  if (a.tagName !== 'A') return false;
  return only.textContent.trim() === a.textContent.trim();
}

/**
 * Classifies a row by its content.
 * @param {Element} row The authored row
 * @returns {string} One of title | icon | cta | body
 */
function classifyRow(row) {
  if (row.querySelector(HEADING)) return 'title';
  if (row.querySelector(ICON)) return 'icon';
  if (isCtaRow(row)) return 'cta';
  return 'body';
}

/**
 * Moves every node of every cell of a row into a wrapper, then drops the row.
 * @param {Element} row The authored row
 * @param {Element} wrapper The destination wrapper
 */
function moveRow(row, wrapper) {
  [...row.children].forEach((cell) => {
    let node = cell.firstChild;
    while (node) {
      const next = node.nextSibling;
      wrapper.append(node);
      node = next;
    }
  });
  row.remove();
}

/**
 * Decorates the notice block.
 * @param {Element} block The notice block element
 */
export default function decorate(block) {
  const rows = [...block.children].filter((child) => child.classList.length === 0);
  let previous = null;
  rows.forEach((row) => {
    const kind = classifyRow(row);
    let wrapper = null;
    if (kind === 'body' && previous && previous.classList.contains('notice-body')) {
      wrapper = previous;
    } else {
      wrapper = document.createElement('div');
      wrapper.className = `notice-${kind}`;
      block.insertBefore(wrapper, row);
    }
    moveRow(row, wrapper);
    previous = wrapper;
  });
}
