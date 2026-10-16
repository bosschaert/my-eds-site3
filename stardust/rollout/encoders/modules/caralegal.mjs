/**
 * caralegal — the data-protection request form iframe (`iframe.c-caralegal`, webform.caralegal.de;
 * dynamic-features row 13 caralegal-form: embed-passthrough, self). Block: embed (caralegal).
 * One cell: <p><a href="iframe src">src</a></p> — the block JS mounts the same iframe (sandbox
 * allow-forms allow-scripts allow-same-origin, full width, no border). Previously dropped by the
 * core (iframes are structural) → the page lost the form.
 */
export const match = 'iframe.c-caralegal';
export const priority = 10;

export function encode(el, ctx) {
  const { $ } = ctx;
  const src = $(el).attr('src');
  if (!src) return null;
  const href = src.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return ctx.block('embed', ['caralegal'], [[`<p><a href="${href}">${href}</a></p>`]]);
}
