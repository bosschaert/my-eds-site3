/**
 * events-list — career events list `.c-events-list > .o-accordion` (dynamic-features row 2,
 * static snapshot of the captured items). Block: accordion (events). One row per event:
 *   [<p><img></p><p>date</p><p>time</p><p>title</p><p>location</p>, panel (walked default
 *    content; the share lightbox window is chrome and not encoded)]
 * Block JS (events variant) lays the header out like the source (logo | grey date line, h4-look
 * title, grey location).
 */
export const match = '.c-events-list';
export const priority = 10;

const txt = (n) => n.text().replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function encode(el, ctx) {
  const { $ } = ctx;
  const rows = [];
  $(el).find('.o-accordion__item').each((i, it) => {
    const item = $(it);
    const head = item.children('.o-accordion__header').first();
    const img = head.find('picture, img').first();
    const spans = head.find('.col > div').first().children('span').get().map((s) => txt($(s)));
    const title = txt(head.find('.u-text-h4').first());
    const loc = txt(head.find('.col > div').last());
    const label = `${img.length ? `<p>${ctx.img(img)}</p>` : ''}${spans.map((s) => `<p>${esc(s)}</p>`).join('')}`
      + `<p><strong>${esc(title)}</strong></p>${loc && loc !== title ? `<p>${esc(loc)}</p>` : ''}`;
    const inner = item.find('.o-accordion__content-inner').first().clone();
    inner.find('[data-lightbox-dc-window], [data-lightbox-dc-open], .c-sharelist').remove();
    const panel = ctx.walk(inner.get(0)).trim();
    rows.push([label, panel]);
  });
  if (!rows.length) return null;
  // the list's captured pagination (c-pagination: "1") → a pagination-only `search (events)`
  // block after the list (search.js pagination row) — cluster-content
  const pages = $(el).find('.c-pagination__item').get().map((li) => `<li>${esc(txt($(li)))}</li>`).join('');
  const pager = pages ? ctx.block('search', ['events'], [[`<ul>${pages}</ul>`, '<p>pagination</p>']]) : '';
  return ctx.block('accordion', ['events'], rows) + pager;
}
