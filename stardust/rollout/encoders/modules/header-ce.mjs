/**
 * header-ce — a header-only CE (`data-ctype=header`: ONE `.c-media__header` with ONE heading)
 * FOLLOWED in the same column by a CE without a header (text, textmedia, tabs …): the source
 * keeps the header's 1.8286rem margin AND the CE's 3.6571rem margin-bottom, so the next CE sits
 * 64px lower than the default-content rhythm (Vitesco spin-off: h1 → lead, h2 FAQs → tabs;
 * mediathek). Emitted as the heading (default content) + section Style `header-ce-hN` (heading
 * + p) or `header-ce-hN-end` (heading closes its wrapper, a block follows) — CSS in teaser.css
 * with the other section-rhythm rules: the gap after that heading = 1.8286rem + 3.6571rem. Priority 7. (cluster-content)
 */
export const match = '.o-page__ce[data-ctype="header"]';
export const priority = 7;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const kids = ce.children();
  if (kids.length !== 1 || !kids.first().is('.c-media__header')) return null;
  const heads = kids.first().children('h1, h2, h3');
  if (heads.length !== 1 || kids.first().children().length !== 1) return null;
  const next = ce.next();
  if (!next.is('.o-page__ce') || next.children('.c-media__header').length) return null;
  if (next.find('form').length) return null; // webform.css owns the form CE rhythm
  // next CE opens with rich text → the heading is followed by a <p> in default content
  // (`header-ce-hN`); otherwise its first output is a block → the heading ends its wrapper
  // (`header-ce-hN-end`)
  const text = next.find('> .row > .col .c-media__text, > .row > .col > .s-richtext').first();
  const tag = heads.get(0).tagName;
  let style = text.length && text.children().first().is('p') ? `header-ce-${tag}` : `header-ce-${tag}-end`;
  // inside a section header row the header loses its margin (.o-container__header
  // .c-media__header:last-child) → only the CE gap (3.6571rem): suffix -hr (mediathek panels)
  if (ce.closest('.row.o-container__header').length) style += '-hr';
  return { html: ctx.clean(heads.get(0)), sectionStyle: style };
}
