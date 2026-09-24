/**
 * front-nav — the home page's mobile menu list (source `.p-front-nav > nav.l-global-menu`);
 * the source hides the whole section from 960px (CSS), so it is mobile-only chrome-like
 * content authored on the page.
 *
 * Authoring: one row, one cell holding the nested list —
 *   <ul><li>WORKS<ul><li><a>造園</a></li>…</ul></li><li><a>SERVICE/FLOW</a></li>…</ul>
 *
 * decorate() builds the source's `nav.l-global-menu` shell and MOVES the authored <ul>
 * in (EW1). Live DECODE (#98): each item's trigger link may arrive as <li><p><a>, and the
 * WORKS title as <li><p>WORKS</p><ul> — both shapes are matched and unwrapped/kept.
 * WORKS accordion: the title click toggles `aria-expanded` on the li and `is-visible`
 * on the sub-list (source behaviour, stardust/prototypes/js/index.js).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * Normalizes the authored list: unwraps <li><p><a> triggers, keeps an accordion parent's
 * title (<p> on live, a bare text node — moved into a generated span — off the pipeline)
 * as the first child and wires the toggle.
 * @param {Element} list the authored <ul>
 */
function prepareList(list) {
  list.querySelectorAll(':scope > li').forEach((item) => {
    const sub = item.querySelector(':scope > ul');
    const p = item.querySelector(':scope > p');
    if (p && !sub) {
      p.replaceWith(...p.childNodes);
      return;
    }
    if (!sub) return;
    let title = item.querySelector(':scope > p, :scope > span');
    if (!title) {
      // HARNESS/bare-text shape: move the existing text nodes, never copy their text
      title = el('span');
      [...item.childNodes]
        .filter((n) => n !== sub && n.nodeType === Node.TEXT_NODE)
        .forEach((n) => title.append(n));
      item.prepend(title);
    }
    sub.querySelectorAll(':scope > li > p').forEach((sp) => sp.replaceWith(...sp.childNodes));
    item.setAttribute('aria-expanded', 'false');
    title.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      sub.classList.toggle('is-visible', !expanded);
    });
  });
}

export default function decorate(block) {
  const list = block.querySelector('ul');
  if (!list) return;
  const nav = el('nav', 'l-global-menu');
  nav.setAttribute('aria-label', 'Site menu');
  nav.append(list);
  prepareList(list);
  // leftovers pass: anything authored besides the list stays visible
  [...block.querySelectorAll(':scope > div > div > *')].forEach((n) => nav.append(n));
  block.replaceChildren(nav);
}
