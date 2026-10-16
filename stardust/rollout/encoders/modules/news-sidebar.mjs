/**
 * news-sidebar — TYPO3 `.c-news-sidebar` (solr news result list: c-teaser cards with a bold
 * <time> date before the teaser text, + an optional "show all" c-button--internal link).
 * Block: news-sidebar. One row per news card, result order:
 *   [<img> (alt verbatim), <h3>c-teaser__header</h3> + <p><strong>date</strong> text</p> +
 *    <p><a href title>c-teaser__link label</a></p>]
 * then, when present, a last one-cell row with the list link: <p><strong><a href>label</a></strong></p>.
 * The block renders the cards as a teaser grid (cols-3) and the link centred under it.
 * The source list is a server-side (solr) query: the authored rows are the captured snapshot.
 */
export const match = '.c-news-sidebar';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

export function encode(el, ctx) {
  const { $ } = ctx;
  const cards = $(el).find('.c-teaser').get();
  if (!cards.length) return null;
  const rows = cards.map((c) => {
    const t = $(c);
    const img = ctx.img(t.find('.c-teaser__image img, .c-teaser__image picture').first());
    const header = txt(t.find('.c-teaser__header').first());
    const paras = t.find('.c-teaser__text p').get().map((p) => {
      const pn = $(p).clone();
      const time = pn.find('time').first();
      const date = time.length ? txt(time) : '';
      time.remove();
      const rest = txt(pn);
      if (!date && !rest) return '';
      return `<p>${date ? `<strong>${esc(date)}</strong> ` : ''}${esc(rest)}</p>`;
    }).join('');
    const href = t.is('a') ? t.attr('href') : t.find('a[href]').first().attr('href');
    const label = txt(t.find('.c-teaser__link').first());
    const ti = t.attr('title') ? ` title="${attr(t.attr('title'))}"` : '';
    const link = href ? `<p><a href="${attr(ctx.abs(href))}"${ti}>${esc(label || header)}</a></p>` : '';
    const body = `${header ? `<h3>${esc(header)}</h3>` : ''}${paras}${link}`;
    return img ? [img, body] : [body];
  });
  const more = $(el).find('a[href]').filter((i, a) => !$(a).closest('.c-teaser').length
    && !$(a).is('.c-teaser')).first();
  if (more.length) {
    rows.push([`<p><strong><a href="${attr(ctx.abs(more.attr('href')))}">${esc(txt(more))}</a></strong></p>`]);
  }
  return ctx.block('news-sidebar', [], rows);
}
