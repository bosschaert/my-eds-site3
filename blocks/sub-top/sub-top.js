/**
 * sub-top — sub-page head: title + local nav, breadcrumb, full-bleed visual.
 * Decode tier: template-slotted (fixed composition). Authored nodes are MOVED
 * into empty slot containers by role; nothing is rebuilt from text.
 *
 * Rows (each one cell, roles classified by content, order-tolerant):
 *   - heading (h1/h2) + list of links  -> title + local nav (strong = active)
 *   - "Page Location" heading + list    -> breadcrumb
 *   - picture                           -> visual
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/** source behaviour: 1.4s after load, scroll past the visual unless deep-linked */
function autoScrollPastVisual(visual) {
  if (window.location.hash) return;
  setTimeout(() => {
    const bottom = visual.getBoundingClientRect().bottom + window.scrollY;
    if (window.scrollY < bottom) window.scrollTo({ top: bottom, behavior: 'smooth' });
  }, 1400);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .sub-page-info')) return; // EW9 re-entrant

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const info = el('div', 'sub-page-info inner');
  const left = el('div', 'left-area');
  const subNav = el('nav', 'sub-nav');
  const crumb = el('nav', 'breadcrumb');
  const visual = el('div', 'sub-visual');

  cells.forEach((cell) => {
    const heading = cell.querySelector('h1, h2, h3');
    const list = cell.querySelector('ul, ol');
    const picture = cell.querySelector('picture, img');
    const isCrumb = list && list.querySelector('li img, li picture');
    if (isCrumb) {
      if (heading) crumb.append(heading);
      crumb.append(list);
    } else if (heading || (list && !picture)) {
      if (heading) left.append(heading);
      if (list) subNav.append(list);
    } else if (picture) {
      const holder = picture.closest('p') || picture;
      visual.append(holder);
    }
    // leftovers: any remaining authored element keeps its place in the visual slot
    [...cell.children].forEach((rest) => visual.append(rest));
  });

  // local nav label = the breadcrumb's parent level (source aria-label)
  const crumbs = crumb.querySelectorAll('li');
  const parentLevel = crumbs.length > 2 ? crumbs[crumbs.length - 2].textContent.trim() : '';
  if (parentLevel) subNav.setAttribute('aria-label', parentLevel);
  if (subNav.children.length) left.append(subNav);
  info.append(left);
  if (crumb.children.length) info.append(crumb);
  block.replaceChildren(info);
  if (visual.children.length) {
    block.append(visual);
    autoScrollPastVisual(visual);
  }
}
