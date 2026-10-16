/*
 * country-selector — source c-country-selector (regions of countries with language links).
 * Authoring (one row per line, top to bottom):
 *   one cell with a heading  → starts a region (title);
 *   two cells                → a country: [:icon: Name] [language links, " | " between them];
 *   one cell without heading → free content of the current region (e.g. a list of links).
 * A region without countries renders as a secondary region (smaller title).
 * Authored nodes are moved, never rebuilt; decorate() is re-entrant.
 */
function wrap(className, nodes) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...nodes);
  return div;
}

function newRegion(container) {
  const region = document.createElement('div');
  region.className = 'country-selector-region';
  container.append(region);
  return { el: region, list: null };
}

export default function decorate(block) {
  if (block.querySelector(':scope > .country-selector-region')) return;
  const rows = [...block.children];
  const regions = [];
  let current = null;

  rows.forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('img, .icon'));
    if (!cells.length) return;
    const heading = cells.length === 1 && cells[0].querySelector('h1, h2, h3, h4, h5, h6');
    if (heading || !current) {
      current = newRegion(block);
      regions.push(current);
    }
    if (heading) {
      current.el.append(wrap('country-selector-title', [...cells[0].childNodes]));
      return;
    }
    if (cells.length >= 2) {
      if (!current.list) {
        current.list = document.createElement('ul');
        current.list.className = 'country-selector-list';
        current.el.append(current.list);
      }
      const li = document.createElement('li');
      li.className = 'country-selector-country';
      li.append(
        wrap('country-selector-name', [...cells[0].childNodes]),
        wrap('country-selector-languages', [...cells[1].childNodes]),
      );
      current.list.append(li);
      return;
    }
    current.el.append(wrap('country-selector-text', [...cells[0].childNodes]));
  });

  rows.forEach((row) => row.remove());
  regions.forEach((r) => {
    if (!r.list) r.el.classList.add('is-secondary');
  });
}
