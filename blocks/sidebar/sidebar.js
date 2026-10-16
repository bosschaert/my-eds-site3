/**
 * sidebar — section layout of the source `o-container__content > .row` with a main column
 * (col-12 col-md-8 col-lg-9) and `o-container__sidebar` (col-12 col-md-4 col-lg-3).
 *
 * Content: the section's main-column content comes first (default content / blocks), then this
 * block, then the sidebar's own blocks (e.g. content-list). The block's single cell holds the
 * sidebar's default content (may be empty — the column then only reserves its width).
 * Decoration: the cell's nodes are MOVED into the aside (EW1); this wrapper and every wrapper
 * after it are moved into `.sidebar-aside` at the end of the section, the section gets
 * `.has-sidebar` (sidebar.css: grid 75/25 >= 1279, 66.67/33.33 >= 1023, stacked below with the
 * aside last). Re-entrant (EW9).
 */
export default function decorate(block) {
  const section = block.closest('.section');
  const wrapper = block.parentElement;
  if (!section || block.querySelector('.sidebar-content')) return;
  const content = document.createElement('div');
  content.className = 'sidebar-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
    row.remove();
  });
  block.append(content);
  if (section.querySelector(':scope > .sidebar-aside')) return;
  const aside = document.createElement('div');
  aside.className = 'sidebar-aside';
  const moved = [];
  for (let node = wrapper; node; node = node.nextElementSibling) moved.push(node);
  aside.append(...moved);
  section.append(aside);
  section.classList.add('has-sidebar');
}
