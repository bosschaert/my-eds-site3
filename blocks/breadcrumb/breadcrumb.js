/**
 * breadcrumb — the source c-breadcrumb trail (content templates).
 *
 * Content: one cell holding a list; each <li> is a trail step — a link for the ancestors, plain
 * text for the current page (last item). Chevron spacers are block chrome.
 * Reconstructive decode: the authored links / text nodes are MOVED (EW1), re-entrant (EW9).
 */
// icons via the foundation helper; dynamic so the block also installs where /scripts/ cannot be
// resolved (local structural harness) — there the bare icon box is used
async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '', tag = 'i') => {
      const box = document.createElement(tag);
      box.className = `u-icon ${classes}`.trim();
      const span = document.createElement('span');
      span.className = `icon icon-${name}`;
      box.append(span);
      return box;
    };
  }
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default async function decorate(block) {
  if (block.querySelector('nav')) return;
  const uIcon = await iconFactory();
  const list = block.querySelector('ul, ol');
  if (!list) return;
  const steps = [...list.children].filter((li) => li.tagName === 'LI');
  const nav = el('nav', 'breadcrumb-nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  list.classList.add('breadcrumb-list');
  steps.forEach((li, i) => {
    const last = i === steps.length - 1;
    if (i > 0) {
      const spacer = el('li', 'breadcrumb-item is-spacer');
      spacer.setAttribute('aria-hidden', 'true');
      spacer.append(uIcon('chevron-right', 'is-xs'));
      li.before(spacer);
    }
    li.className = `breadcrumb-item${last ? ' is-current' : ''}`;
    const a = li.querySelector('a');
    const label = el('span');
    label.append(...(a || li).childNodes);
    if (a && !last) {
      a.className = 'breadcrumb-link';
      if (!a.title) a.title = label.textContent.trim();
      a.append(label);
    } else {
      const cur = el('span', 'breadcrumb-link');
      cur.title = label.textContent.trim();
      cur.append(label);
      if (last) cur.setAttribute('aria-current', 'page');
      if (a) a.replaceWith(cur);
      else li.append(cur);
    }
  });
  nav.append(list);
  block.replaceChildren(nav);
}
