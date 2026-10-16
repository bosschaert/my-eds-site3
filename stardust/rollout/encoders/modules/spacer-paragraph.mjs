/**
 * spacer-paragraph — `<p>&nbsp;</p>` spacer paragraphs inside a section HEADER CE
 * (`.o-container__header`): the core drops them as empty (String.trim() strips U+00A0), but the
 * source renders each as a full paragraph line + margin (en-investors header: 2 spacers = 120px
 * at 1440). Emitted as `<p><br></p>` (one empty line, same box; the delivery pipeline drops a
 * `<p>&nbsp;</p>`). Elsewhere they stay dropped.
 */
export const match = '.o-container__header p';
export const priority = 50;

export function encode(el, ctx) {
  const { $ } = ctx;
  const p = $(el);
  if (p.children().length || !/^[ \s]+$/.test(p.text()) || !p.text().includes(' ')) return null;
  return '<p>&#8203;</p>';
}
