/**
 * social-features — the source's `cmp-socialFeatures` row under a page's brief title: like,
 * share and favorite icons with their counters. Template-slotted (#95): the icon row is the
 * prototype's inner DOM as wrappers; the authored share-channel icon MOVES into the (hidden)
 * share popup (EW1). Ships the STATIC tier of stardust/dynamic-features.md row 2 — the
 * first-party `socialFeaturesPost.json` counter API is dead on the new origin: the icons and
 * the captured (empty) counters render, nothing posts, the share / sign-in / error popups stay
 * hidden as captured (their placeholder strings `errorMessage` / `requestToSignInContent` are
 * never authored — recorded in stardust/eds-conversion-log.md).
 * Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-herzinsuffizienz.json § brief.
 *
 * Authoring — ONE row, ONE cell: the share-channel icon (the mail SVG the share popup lists),
 * optional. Any authored text is kept visible after the icon row (leftovers pass, EW1).
 * Glyphs are CSS `::before` content (icomoon) — decorate() adds no words (#100).
 * @param {Element} block the block element
 */
function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function iconItem(kind, label) {
  const item = el('li', `social-item social-item-${kind}`);
  const icon = el('div', 'social-icon', label ? { 'aria-label': label } : {});
  icon.append(el('span', `social-glyph social-glyph-${kind}`, { 'aria-hidden': 'true' }));
  icon.append(el('span', 'social-count'));
  item.append(icon);
  return item;
}

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const pics = [...block.querySelectorAll('picture, img')]
    .filter((img) => !(img.tagName === 'IMG' && img.closest('picture')))
    .map((img) => img.closest('a') || img);
  const leftovers = cells.flatMap((cell) => [...cell.children])
    .filter((node) => node.textContent.trim());

  const base = el('div', 'social-base');
  const wrap = el('div', 'social-wrap');
  const list = el('ul', 'social-list');
  list.append(iconItem('like'), iconItem('share', 'Share'), iconItem('favorite', 'Save'));
  wrap.append(list);

  const share = el('div', 'social-popup social-popup-share', { hidden: '' });
  const shareList = el('ul', 'social-share-list');
  pics.forEach((pic) => {
    const li = el('li', 'social-share-item');
    li.append(pic);
    shareList.append(li);
  });
  share.append(shareList);
  wrap.append(share);
  base.append(wrap);

  const out = [base];
  if (leftovers.length) {
    const note = el('div', 'social-note');
    note.append(...leftovers);
    out.push(note);
  }
  block.replaceChildren(...out);
}
