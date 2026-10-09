/**
 * breadcrumb — the source's `.breadcrumb-bar > nav.breadcrumb` trail (template-slotted, #95).
 * Schema: stardust/eds-schema/fr-startseite.json (the bar sits above the prototype's first
 * <section>; on the home page the single "Home" crumb is hidden by the canon rule, 0px tall).
 *
 * Authoring: ONE row, ONE cell holding a <ul> — one <li> per crumb, linked crumbs as
 * <li><a href>…</a></li>, the current page as plain text in the last <li>
 * (a list is one editable unit — EW5). The authored list MOVES into the nav (EW1).
 * @param {Element} block the block element
 */
export default async function decorate(block) {
  const list = block.querySelector('ul, ol');
  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';
  nav.setAttribute('aria-label', 'Chemin de navigation');
  if (list) {
    nav.append(list);
  } else {
    // leftovers pass: no list authored (off-pipeline shape) — keep every authored node visible
    block.querySelectorAll(':scope > div > div').forEach((cell) => nav.append(...cell.childNodes));
  }
  block.replaceChildren(nav);
}
