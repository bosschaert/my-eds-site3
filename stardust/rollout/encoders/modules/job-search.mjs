/**
 * job-search — the con-jobs Angular search widget (`<app-root>` c-job-widget-search: keyword,
 * location, proximity, "offers for" toggle, submit → jobs.continental.com/<lang>/#/?searchTerm=…;
 * de-karriere, en-career, es-mx-carrera). dynamic-features row 11 job-widget: the Angular bundle
 * is not shipped (CSP trusted types); the block rebuilds the same form and submits to the same
 * portal URL. Block: job-search. Rows (strings verbatim from the hydrated widget):
 *   [<p>keyword label</p>, <p>keyword placeholder</p>]
 *   [<p>location label</p>, <p>location placeholder</p>]
 *   [<p>proximity label</p>, <p>option</p>…]
 *   [<p>offers-for label</p>, <p>option</p>…]          (when the widget shows the type toggle)
 *   [<p><a href="https://jobs.continental.com/<lang>/#/">submit label</a></p>]
 * Variant wide (+ section Style full-bleed): the widget sits directly in <main> (full width,
 * es-mx-carrera) instead of a container column.
 */
export const match = 'app-root';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();
const ps = (list) => list.map((t) => `<p>${esc(t)}</p>`).join('');

export function encode(el, ctx) {
  const { $ } = ctx;
  const root = $(el);
  const box = root.find('.c-job-search-box').first();
  if (!box.length) return null;
  const cfgText = root.parent().find('script').map((i, s) => $(s).html()).get()
    .find((s) => /"targetLanguage"/.test(s || ''));
  const lang = ((cfgText || '').match(/"targetLanguage":"([a-z-]+)"/) || [])[1];
  if (!lang) {
    ctx.warn('job-search: no targetLanguage in the widget config');
    return null;
  }
  const field = (id) => {
    const input = box.find(`#${id}`);
    return [txt(box.find(`label[for="${id}"]`).first()), input.attr('placeholder') || ''];
  };
  const rows = [];
  const kw = field('searchword');
  const loc = field('location');
  rows.push([ps([kw[0]]), ps([kw[1]])]);
  rows.push([ps([loc[0]]), ps([loc[1]])]);
  const radius = box.find('#radius');
  rows.push([ps([txt(box.find('label[for="radius"]').first())]),
    ps(radius.find('option').get().map((o) => txt($(o))))]);
  const group = box.find('.c-job-form__radio-group');
  if (group.length) {
    const label = txt(group.parent().children('.c-job-form__label').first());
    rows.push([ps([label]), ps(group.find('label').get().map((l) => txt($(l))))]);
  }
  const submit = txt(box.find('.c-job-form__submit').first());
  rows.push([`<p><a href="https://jobs.continental.com/${lang}/#/">${esc(submit)}</a></p>`]);
  // a widget placed directly in <main> (es-mx-carrera) spans the page: own full-bleed band
  if (root.parent().is('main')) return { html: ctx.block('job-search', ['wide'], rows), sectionStyle: 'full-bleed' };
  return ctx.block('job-search', [], rows);
}
