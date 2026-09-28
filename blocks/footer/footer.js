/**
 * Footer — template-slotted chrome for www.niravmanubhai.com (stardust:replica).
 * Moves the authored /footer document (one list of links) into the source's
 * `footer.nmh-footer` row. Authored elements are MOVED (EW1); the wrapper carries the class.
 */

function readMeta(name) {
  const meta = document.head.querySelector(`meta[name="${name}"]`);
  return meta ? meta.getAttribute('content') : '';
}

/** The authored elements of one section (runtime `.default-content-wrapper` or a raw cell). */
function authoredItems(section) {
  const wrappers = section.querySelectorAll('.default-content-wrapper');
  if (wrappers.length) return [...wrappers].flatMap((wrapper) => [...wrapper.children]);
  return [...section.children];
}

/**
 * Sections of the footer document. At runtime the block arrives with one empty row and the
 * document is fetched as a fragment; in the local harness the authored rows are already in place.
 */
async function loadSections(block) {
  const rows = [...block.children];
  const authored = rows.some((row) => row.querySelector('a, p, ul, ol, picture, img')
    || row.textContent.trim());
  if (authored) return rows.map((row) => row.firstElementChild || row);
  const footerMeta = readMeta('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const { loadFragment } = await import('../fragment/fragment.js');
  const fragment = await loadFragment(footerPath);
  return fragment ? [...fragment.children] : [];
}

/**
 * Loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const sections = await loadSections(block);
  const row = document.createElement('div');
  row.className = 'nmh-footer';
  sections.forEach((section) => row.append(...authoredItems(section)));
  block.replaceChildren(row);
}
