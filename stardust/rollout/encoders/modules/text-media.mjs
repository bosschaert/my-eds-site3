/**
 * text-media — TYPO3 content element `.o-page__ce` holding `.c-media__header` +
 * `.row > .col > .c-media__content.is-textpic` (c-media__gallery? + c-media__text).
 *
 * Text-only CE with a plain heading header → DEFAULT CONTENT (headings + richtext), no block:
 * the foundation's default-content rhythm (3.66rem between CEs, 1.83rem header→text) equals it.
 * Otherwise → block `text-media` with variants:
 *   image-below (is-image-below) | image-left / image-right (is-image-intext + side) |
 *   none = image above; `heading-light` when the header heading is .u-text-light.
 * Rows: [media cell] (only when there are images: per figure <img> (wrapped in <a> when the
 * source picture is linked) + caption / creator as <p>), then [text cell]: optional meta <p>
 * (c-media__meta eyebrow) + header headings + the c-media__text children (walked, so nested
 * modules still dispatch).
 * Galleries holding anything but images (is-video embeds) → null: left for a video module.
 */
export const match = '.o-page__ce:has(> .row > .col > .c-media__content.is-textpic)';

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const content = ce.find('> .row > .col > .c-media__content').first();
  const header = ce.children('.c-media__header').first();
  const gallery = content.children('.c-media__gallery');
  if (gallery.find('.c-media__embed').not('.is-image').length) return null;
  const cls = (content.attr('class') || '').split(/\s+/);

  const figures = gallery.find('.c-media__embed.is-image figure').get();
  const variants = [];
  if (figures.length && cls.includes('is-image-below')) variants.push('image-below');
  if (figures.length && cls.includes('is-image-intext')) {
    variants.push(cls.includes('is-image-left') ? 'image-left' : 'image-right');
  }
  if (header.find('.u-text-light').length) variants.push('heading-light');

  const meta = header.children('.c-media__meta');
  const headParts = header.children().get().map((h) => ($(h).is('.c-media__meta')
    ? `<p>${ctx.cleanChildren(h).trim()}</p>`
    : ctx.clean(h)));
  const text = content.children('.c-media__text').get().map((t) => ctx.walk(t)).join('');

  if (!figures.length && !meta.length && !variants.length) {
    return headParts.join('') + text; // default content
  }
  const media = figures.map((f) => {
    const fig = $(f);
    const img = ctx.img(fig.find('picture, img').first());
    const link = fig.find('a[href]').filter((i, a) => $(a).find('picture, img').length).first();
    const pic = link.length ? `<a href="${ctx.abs(link.attr('href'))}">${img}</a>` : img;
    const cap = fig.find('figcaption').first();
    const capText = cap.clone().children('.c-image__creator').remove().end()
      .text()
      .trim();
    const creator = cap.find('.c-image__creator').text().trim();
    return `<p>${pic}</p>${capText ? `<p>${capText}</p>` : ''}${creator ? `<p>${creator}</p>` : ''}`;
  }).join('');
  const rows = [];
  if (media) rows.push([media]);
  const body = headParts.join('') + text;
  if (body.trim()) rows.push([body]);
  return ctx.block('text-media', variants, rows);
}
