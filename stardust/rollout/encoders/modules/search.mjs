/**
 * search — Solr search / listing widgets (`.c-search`: press releases, media library; the career
 * events filter form). dynamic-features row 2 (solr-listings: static-snapshot, interim): the
 * CAPTURED first page is authored — search box, filter tabs + the visible tab's options,
 * result count + sort label, result items, pagination, active filter tag. Facets / paging are not
 * live (logged as a dynamic-dependency deviation per page).
 * Block: search. Rows (the LAST cell names the row kind — layout configuration):
 *   [<p>placeholder</p>, search]
 *   [<p>label</p>?<ul><li>tab</li>…</ul>, filters]        — first tab active
 *   [<ul><li>option</li>…</ul>, options]                  — the visible tab's options
 *                                                          (<strong> = the captured checked one)
 *   [<ul><li>label <em>(count)</em></li>…</ul>, facets]   — document-type tabs, first active
 *   [<p>count</p><p>sort label</p>?, count]
 *   [<p><img></p>, <p>type</p><p>date</p><h3><a>title</a></h3><p>teaser</p><p>n Dokument(e)</p>?, result]
 *   [<ul><li><a>1</a></li>…</ul>, pagination]
 *   [<p>tag text</p>, tag]
 * Variant `events` (cluster-content): the career events filter form (gray filter box).
 */
export const match = '.c-search, form:has(.c-search)';
export const priority = 10;

const txt = (n) => n.text().replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const kind = (k) => `<p>${k}</p>`;

export function encode(el, ctx) {
  const { $ } = ctx;
  const root = $(el);
  if (root.is('.c-search') && root.parent().closest('form:has(.c-search)').length) return null;
  const rows = [];
  const input = root.find('.c-search__input').first();
  if (!input.length) return null;
  rows.push([`<p>${esc(input.attr('placeholder') || '')}</p>`, kind('search')]);
  const tabs = root.find('.o-tabs').first();
  if (tabs.length) {
    const label = tabs.find('.c-search__filter-by-label').first();
    const items = tabs.find('.o-tabs__header-item').not('.c-search__filter-by-label').get()
      .map((h) => `<li>${esc(txt($(h)))}</li>`).join('');
    rows.push([`${label.length ? `<p>${esc(txt(label))}</p>` : ''}<ul>${items}</ul>`, kind('filters')]);
    const visible = tabs.find('.o-tabs__content-item.is-visible').first();
    const opts = visible.find('label.c-search__filter-option, label.c-form__radio, label.c-form__checkbox')
      .filter((i, l) => !$(l).closest('.row.mt-4, .c-search__custom-date-filter').length)
      .get().map((l) => {
        // the captured checked option (input[checked]; the capture serialised it `checke`)
        const on = $(l).find('input').is('[checked], [checke]');
        return `<li>${on ? `<strong>${esc(txt($(l)))}</strong>` : esc(txt($(l)))}</li>`;
      }).join('');
    if (opts) rows.push([`<ul>${opts}</ul>`, kind('options')]);
  }
  // document-type facet tabs (press releases: Alle | Pressemitteilungen (1136) | …); the trailing
  // filler tab is chrome — cluster-content
  const facets = root.find('.c-search__facet-tab').not('.d-none').get()
    .filter((t) => txt($(t))).map((t) => {
      const c = $(t).find('.c-search__facet-tab-count');
      const label = txt($(t).clone().children('.c-search__facet-tab-count').remove().end());
      return `<li>${esc(label)}${c.length ? ` <em>${esc(txt(c))}</em>` : ''}</li>`;
    }).join('');
  if (facets) rows.push([`<ul>${facets}</ul>`, kind('facets')]);
  root.find('.c-tag__name').each((i, t) => rows.push([`<p>${esc(txt($(t)))}</p>`, kind('tag')]));
  const count = txt(root.find('.c-search__result-count').first());
  const sort = txt(root.find('.c-search__sort-label').first());
  if (count) rows.push([`<p>${esc(count)}</p>${sort ? `<p>${esc(sort)}</p>` : ''}`, kind('count')]);
  root.find('.c-search__result-item').each((i, r) => {
    const item = $(r);
    const img = item.find('img.c-search__result-image').first();
    const a = item.find('.c-search__result-title a').first();
    const parts = [
      txt(item.find('.c-search__result-type').first()),
      txt(item.find('.c-search__result-date').first()),
    ].filter(Boolean).map((t) => `<p>${esc(t)}</p>`);
    parts.push(`<h3><a href="${attr(ctx.abs(a.attr('href') || ''))}">${esc(txt(a))}</a></h3>`);
    const teaser = txt(item.find('.c-search__result-content > p').first());
    if (teaser) parts.push(`<p>${esc(teaser)}</p>`);
    const dl = txt(item.find('.c-search__download-count').first());
    if (dl) parts.push(`<p>${esc(dl)}</p>`);
    rows.push([img.length ? `<p>${ctx.img(img)}</p>` : '', parts.join(''), kind('result')]);
  });
  const pages = root.find('.c-pagination__item').get().map((li) => {
    const l = $(li);
    const a = l.find('a[href]').first();
    const t = txt(l);
    if (!t) return '';
    return a.length ? `<li><a href="${attr(ctx.abs(a.attr('href')))}">${esc(t)}</a></li>` : `<li>${esc(t)}</li>`;
  }).join('');
  if (pages) rows.push([`<ul>${pages}</ul>`, kind('pagination')]);
  // career events filter form: the filters sit in a u-bg-lightgrey box → variant `events`
  const events = root.is('form') && root.find('.u-bg-lightgrey').length;
  return ctx.block('search', events ? ['events'] : [], rows);
}
