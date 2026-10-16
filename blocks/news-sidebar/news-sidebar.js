/**
 * news-sidebar — the source c-news-sidebar (solr news result list in the IR news tabs):
 * teaser cards (16:9 image, header, bold date + teaser text, "read" link) in a 3-column grid,
 * then an optional centred "show all" button.
 *
 * Content: one row per news card — [image, <h3>header</h3> + <p><strong>date</strong> text</p>
 * + <p><a href>link label</a></p>] — and optionally a last row holding only the list link.
 * The cards are rendered by the teaser block (loaded on a nested `.teaser.cols-3`, same DOM /
 * CSS as the teaser grid). Reconstructive decode: authored rows / links are MOVED (EW1);
 * re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

export default async function decorate(block) {
  if (block.querySelector('.news-sidebar-results')) return;
  const rows = [...block.children];
  const cards = rows.filter((r) => r.querySelector('picture, img, h1, h2, h3, h4, h5, h6'));
  const more = rows.filter((r) => !cards.includes(r) && r.querySelector('a[href]'));
  rows.filter((r) => !cards.includes(r) && !more.includes(r)).forEach((r) => r.remove());

  const results = el('div', 'news-sidebar-results');
  const teaser = el('div', 'teaser cols-3 news block');
  teaser.dataset.blockName = 'teaser';
  teaser.dataset.blockStatus = 'initialized';
  teaser.append(...cards);
  results.append(teaser);
  if (more.length) {
    const footer = el('div', 'news-sidebar-more');
    more.forEach((r) => {
      [...r.querySelectorAll('a[href]')].forEach((a) => {
        const p = a.closest('p') || el('p', '', a);
        p.className = 'button-wrapper';
        // source a.c-button--internal: arrow icon whatever the href (absolute until localized)
        a.className = 'c-button is-internal';
        footer.append(p);
      });
      r.remove();
    });
    results.append(footer);
  }
  block.append(results);
  if (cards.length) {
    try {
      const { loadBlock } = await import('../../scripts/aem.js');
      await loadBlock(teaser);
    } catch (e) {
      // structural harness without /scripts/: cards stay as authored rows
    }
  }
}
