/**
 * contact-list — TYPO3 `.c-contact` person cards (IR contact pages: portrait, name, job title,
 * optional note, list of phone / e-mail links). Consecutive `.c-contact` siblings → ONE block
 * `contact-list`, one row per person, source order:
 *   [<p><img></p>, <p><strong>name</strong></p><p>job title</p>[<p>note</p>…]
 *                  <ul><li><a href="tel:…">number</a></li><li><a href="mailto:…">address</a></li></ul>]
 * The label icons (phone / e-mail) are block chrome, chosen from the link scheme. `has-bg`
 * (gray card) → variant `has-bg`. The first `.c-contact` of a run claims the run; the others
 * return '' (already emitted).
 */
export const match = '.c-contact';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

function person($, c, ctx) {
  const k = $(c);
  const pic = k.find('picture, img').first();
  const img = pic.length ? `<p>${ctx.img(pic)}</p>` : '';
  const paras = k.find('p').get().map((p) => ctx.clean(p)).join('');
  const items = k.find('.c-contact__list-item').get().map((li) => {
    const a = $(li).find('.c-contact__value a[href]').first();
    if (!a.length) {
      const v = txt($(li).find('.c-contact__value'));
      return v ? `<li>${esc(v)}</li>` : '';
    }
    return `<li><a href="${attr(a.attr('href'))}">${esc(txt(a))}</a></li>`;
  }).join('');
  return [img, `${paras}${items ? `<ul>${items}</ul>` : ''}`];
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  if (node.prev().is('.c-contact')) return '';
  const run = [el];
  let next = node.next();
  while (next.is('.c-contact')) {
    run.push(next.get(0));
    next = next.next();
  }
  const variants = node.is('.has-bg') ? ['has-bg'] : [];
  return ctx.block('contact-list', variants, run.map((c) => person($, c, ctx)));
}
