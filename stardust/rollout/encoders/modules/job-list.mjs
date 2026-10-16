/**
 * job-list — TYPO3 con-jobs `list` CE (`.o-page__ce` holding `.c-job-widget-list`): the latest
 * job openings rendered server-side (en-pt, pt-pt, sk-sk, es-mx-carrera). Captured snapshot of a
 * server-side query (dynamic-features row 11, job-widget) — the jobs portal stays the live list.
 * Output: the CE header heading(s) as default content, then block job-list:
 *   one row per job — [title (<p><a href>title</a></p>; an empty source href = the page URL),
 *                       <p>function</p> (empty cell when blank), <p>location</p>]
 *   last row (optional) — [<p><strong><a href>all jobs label</a></strong></p>] (c-button below)
 */
export const match = '.o-page__ce:has(> .c-job-widget-list)';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const extra = ce.children()
    .not('header.c-media__header, .c-job-widget-list, a.c-button, strong:has(> a.c-button)');
  if (extra.length) return null;
  const head = ce.children('header.c-media__header').find('h1, h2, h3, h4, h5, h6')
    .get().map((h) => ctx.clean(h)).join('');
  const rows = ce.find('> .c-job-widget-list > a.c-job-widget-list__item').get().map((a) => {
    const item = $(a);
    const title = txt(item.find('.c-job-widget-list__title').first());
    // an empty source href (en-pt / pt-pt) links the row to the page itself
    const href = (item.attr('href') || '').trim() || ctx.url;
    const spans = item.find('.c-job-widget-list__list-icon').get()
      .map((i) => txt($(i).nextAll('span').first()));
    const icons = item.find('.c-job-widget-list__list-icon').get()
      .map((i) => $(i).find('[data-identifier]').attr('data-identifier') || '');
    const fn = spans[icons.indexOf('con-function')] || '';
    const loc = spans[icons.indexOf('con-marker')] || '';
    const t = href ? `<p><a href="${attr(ctx.abs(href))}">${esc(title)}</a></p>` : `<p>${esc(title)}</p>`;
    return [t, fn ? `<p>${esc(fn)}</p>` : '', loc ? `<p>${esc(loc)}</p>` : ''];
  });
  if (!rows.length) return null;
  const more = ce.find('> a.c-button[href], > strong > a.c-button[href]').first();
  if (more.length) {
    rows.push([`<p><strong><a href="${attr(ctx.abs(more.attr('href')))}">${esc(txt(more))}</a></strong></p>`]);
  }
  return `${head}${ctx.block('job-list', [], rows)}`;
}
