/**
 * fact-box-spacer — pre-pass, not a block (always returns null). A fact-box text paragraph that
 * ends in `<br>&nbsp;` spacer lines (home: "…Scope 2)<br>&nbsp;", "…tires in fiscal year
 * 2025<br><br>&nbsp;") keeps those lines in the source box height (5 lines = 113px at 1440);
 * the delivery pipeline trims a trailing `&nbsp;` text, which drops the empty lines. The
 * trailing nbsp-only text becomes a zero-width space (U+200B, kept by the pipeline — same
 * technique as spacer-paragraph.mjs).
 */
export const match = '.o-container__content, .c-fact-box';
export const priority = 260;

export function encode(el, ctx) {
  const { $ } = ctx;
  $(el).find('.c-fact-box__text p').each((i, p) => {
    const kids = p.children || [];
    const last = kids[kids.length - 1];
    const prev = kids[kids.length - 2];
    if (last && last.type === 'text' && /^[\s\u00a0]+$/.test(last.data)
      && last.data.includes('\u00a0') && prev && prev.type === 'tag' && prev.name === 'br') {
      last.data = '\u200b';
    }
  });
  return null;
}
