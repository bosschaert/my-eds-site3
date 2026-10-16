/**
 * webform — TYPO3 form framework `form.c-webforms` (sustainability contact forms; dynamic-features
 * row 12 contact-forms: rebuild-native, needs-backend → the form UI is rebuilt, submit shows the
 * "no backend connected" notice). Block: webform. Rows in form order:
 *   [<p>text</p>]                 — legend ("* Pflichtfelder") and free text (.clearfix consent copy)
 *   [<ul><li>step</li>…</ul>]     — the step tabs (o-tabs header items; first = active)
 *   [<p>label</p>, <p>type</p>]   — a field: label verbatim (incl. the required "*"), type =
 *                                   textarea | text | email | checkbox | select (+ required)
 *                                   e.g. "text required"; checkbox label keeps its link
 *   [<p>label</p>, <p>submit</p>] — the submit button label
 * Hidden inputs, the honeypot (input without a label) and framework state are not encoded.
 */
export const match = 'form.c-webforms';
export const priority = 10;

const txt = (n) => n.text().replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function encode(el, ctx) {
  const { $ } = ctx;
  const rows = [];
  const walk = (node) => {
    $(node).children().each((i, c) => {
      const k = $(c);
      if (k.is('.form-required-legend')) {
        rows.push([`<p>${esc(txt(k))}</p>`]);
      } else if (k.is('.o-tabs')) {
        const items = k.find('.o-tabs__header-item').get().map((h) => `<li>${esc(txt($(h)))}</li>`);
        if (items.length) rows.push([`<ul>${items.join('')}</ul>`]);
      } else if (k.is('.form-group-wrap')) {
        const box = k.find('input[type="checkbox"]').first();
        if (box.length) {
          const span = k.find('label span').first();
          const label = ctx.cleanChildren(span.get(0)).replace(/\s+/g, ' ').trim();
          rows.push([`<p>${label}</p>`, `<p>checkbox${box.attr('required') !== undefined ? ' required' : ''}</p>`]);
          return;
        }
        const label = k.children('label').first();
        const field = k.find('textarea, select, input:not([type="hidden"])').first();
        if (!label.length || !field.length) return;
        let type = field.is('textarea') ? 'textarea' : field.is('select') ? 'select' : (field.attr('type') || 'text');
        if (field.attr('required') !== undefined) type += ' required';
        rows.push([`<p>${esc(txt(label))}</p>`, `<p>${type}</p>`]);
      } else if (k.is('.clearfix') || k.is('p')) {
        const html = k.is('p') ? ctx.clean(c) : ctx.cleanChildren(c).trim();
        if (html) rows.push([html]);
      } else if (k.is('.actions')) {
        k.find('button').each((j, b) => rows.push([`<p>${esc(txt($(b)))}</p>`, '<p>submit</p>']));
      } else if (k.is('div') && !k.find('input[type="hidden"]').length) {
        walk(c);
      }
    });
  };
  walk(el);
  if (!rows.some((r) => r.length === 2)) return null;
  return ctx.block('webform', [], rows);
}
