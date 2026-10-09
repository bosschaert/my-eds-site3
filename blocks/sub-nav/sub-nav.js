/**
 * sub-nav — the source's `.list.list--fixed-width` sub-navigation of the PATTRNS template: a
 * white 1180px strip whose 1px bottom border runs to the viewport edges, one inline link per
 * page of the mini-site, the current page highlighted and — as on live (list.theme.js
 * showActiveItemInCenter) — scrolled to the centre of the horizontal scroller once the
 * webfont is applied. Template-slotted (#95): the authored <ul> MOVES into the scroller
 * wrapper (EW1); the current page is marked with `aria-current="page"` on its link (an
 * attribute read by the CSS — never a class on an authored node, EW2) by comparing each
 * link's pathname with the page's own. Mirrors the live `aria-label` (label + trailing space)
 * on every link: an attribute, no rendered words (#100).
 * Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-
 * about-amylodosis-attr.json § sub-nav (5 items, units.json family sub-nav-item).
 *
 * Authoring: ONE row, ONE cell holding a <ul> — one <li><a href>label</a></li> per page
 * (a list is one editable unit, EW5). In-scope targets root-relative and extensionless.
 * @param {Element} block the block element
 */
function pathOf(href) {
  try {
    return new URL(href, window.location.href).pathname.replace(/\.html$/, '').replace(/\/$/, '');
  } catch {
    return '';
  }
}

/** The live clientlib centres the active item in the scroller: r = left − ul/2 + li/2 */
function centre(list) {
  const current = list.querySelector('a[aria-current="page"]');
  const item = current ? current.closest('li') : null;
  if (!item) return;
  const ul = list.getBoundingClientRect();
  const li = item.getBoundingClientRect();
  const r = (li.left - ul.left) + list.scrollLeft - ul.width / 2 + li.width / 2;
  list.scrollLeft = Math.max(0, Math.round(r));
}

export default async function decorate(block) {
  const list = block.querySelector('ul, ol');
  const wrap = document.createElement('div');
  wrap.className = 'sub-nav-list';
  if (list) {
    const here = pathOf(window.location.href);
    list.querySelectorAll('a[href]').forEach((a) => {
      a.setAttribute('aria-label', `${a.textContent} `);
      if (pathOf(a.href) === here) a.setAttribute('aria-current', 'page');
    });
    wrap.append(list);
  } else {
    // leftovers pass: no list authored (off-pipeline shape) — keep every authored node visible
    block.querySelectorAll(':scope > div > div').forEach((cell) => wrap.append(...cell.childNodes));
  }
  block.replaceChildren(wrap);
  if (!list) return;
  // blocks decorate while their section is still hidden (no layout): centre on the first real
  // layout (ResizeObserver) and again once the webfont is applied (the live clientlib computes
  // with Lexia loaded — fallback metrics would land 30px short)
  const run = () => {
    centre(list);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => centre(list));
  };
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => {
      if (list.clientWidth > 0) {
        ro.disconnect();
        run();
      }
    });
    ro.observe(list);
  } else {
    run();
  }
}
