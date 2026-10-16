/**
 * hero-stage-slider — TYPO3 stage hero `.c-heroteaser-fixed` (slider `--slider` with dots /
 * arrows, or a single fixed slide). Shared with the home template (en).
 * Block: hero-stage-slider; section Style `full-bleed` (the source stage sits outside any
 * o-container). One row per `.c-heroteaser-fixed__slide`, source order:
 *   [image cell, text cell]
 *   image: the <picture> renditions in source order (ctx.pictureImgs): <source (min-width:1279px)>,
 *          <source (min-width:767px)>, fallback <img> — alt verbatim (art direction kept).
 *   text:  <p>title</p> (c-heroteaser__title) + <p>description</p> + <p><strong><a>CTA</a></strong></p>
 *          per c-heroteaser__link. A title / description wrapped in `span.u-padded-text`
 *          (white highlight box behind the text) is authored as <p><em>…</em></p>.
 * Variant `text-white` when the slides use c-heroteaser__textcolor-white (black is default).
 * Slides without text → image cell only.
 */
export const match = '.c-heroteaser-fixed';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function textP($, el) {
  const node = $(el);
  if (!node.length) return '';
  const text = node.text().replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return node.find('.u-padded-text').length ? `<p><em>${esc(text)}</em></p>` : `<p>${esc(text)}</p>`;
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const slides = $(el).find('.c-heroteaser-fixed__slide').get();
  if (!slides.length) return null;
  let white = false;
  const rows = slides.map((s) => {
    const slide = $(s);
    const pic = slide.find('.c-heroteaser-fixed__multimedia picture').first();
    const imgs = pic.length ? ctx.pictureImgs(pic).join('')
      : ctx.img(slide.find('.c-heroteaser-fixed__multimedia img').first());
    if (slide.find('.c-heroteaser__textcolor-white').length) white = true;
    const title = textP($, slide.find('.c-heroteaser__title').first());
    const desc = textP($, slide.find('.c-heroteaser__description').first());
    const links = slide.find('a.c-heroteaser__link, .c-heroteaser__links a[href]').get().map((a) => {
      const l = $(a);
      const label = l.text().replace(/\s+/g, ' ').trim();
      const ti = l.attr('title') ? ` title="${attr(l.attr('title'))}"` : '';
      return `<p><strong><a href="${attr(ctx.abs(l.attr('href')))}"${ti}>${esc(label)}</a></strong></p>`;
    });
    // AdmiralCloud video CTA (span.c-button[data-glide-ac-video-start], no href; mediathek slide 1
    // "Video ansehen"): the source plays the clip in place; authored as a link to the same clip on
    // video.continental.com (the source's own lightbox URL for AdmiralCloud ids) — the block gives
    // video links the play icon. The CTA row is what sizes the slider track (C-final).
    slide.find('.c-heroteaser__links span.c-heroteaser__link[data-glide-ac-video-start]').each((_, sp) => {
      const n = $(sp).attr('data-glide-ac-video-start');
      const id = slide.find(`[data-glide-video-wrapper="${n}"] [data-glide-ac-video-container]`).attr('data-glide-ac-video-container')
        || slide.find('[data-glide-ac-video-container]').first().attr('data-glide-ac-video-container');
      const label = $(sp).text().replace(/\s+/g, ' ').trim();
      if (id && label) links.push(`<p><strong><a href="https://video.continental.com/?v=${attr(id)}">${esc(label)}</a></strong></p>`);
    });
    const text = `${title}${desc}${[...new Set(links)].join('')}`;
    if (slide.find('video, iframe').length) ctx.warn('hero-stage-slider: slide video not encoded (image only)');
    return text ? [imgs, text] : [imgs];
  });
  return {
    html: ctx.block('hero-stage-slider', white ? ['text-white'] : [], rows),
    sectionStyle: 'full-bleed',
  };
}
