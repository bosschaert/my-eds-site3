/**
 * flockler — the Flockler social wall / carousel embed (`div#flockler-embed-<embedUuid>` filled by
 * `plugins.flockler.com/embed/<siteUuid>/<embedUuid>`; cs-cz, en-us-career walls, de-karriere,
 * en-career carousels). dynamic-features row 18 social-wall: embed-passthrough. The hydrated
 * posts are vendor DOM and are never copied. Block: embed (flockler). One cell:
 *   <p>embed label</p><p><a href="https://plugins.flockler.com/embed/iframe/<site>/<embed>">URL</a></p>
 *   (label = the embed region's aria-label, e.g. "Czech Republic Facebook Wall" — the frame
 *   title; omitted when the capture has none)
 * — Flockler's own iframe embed of the same feed (the script embed injects markup, which the
 * EDS head's require-trusted-types-for 'script' CSP would block). The block JS sizes the frame
 * from Flockler's FlockerIframeResizeEvent message.
 */
export const match = 'div[id^="flockler-embed-"]';
export const priority = 10;

export function encode(el, ctx) {
  const { $ } = ctx;
  const embed = ($(el).attr('id') || '').replace('flockler-embed-', '');
  if (!/^[0-9a-f]{32}$/.test(embed)) return null;
  const html = $.html();
  const m = html.match(new RegExp(`plugins\\.flockler\\.com/embed/([0-9a-f]{32})/${embed}`));
  if (!m) {
    ctx.warn(`flockler ${embed}: no embed script URL in the capture`);
    return null;
  }
  const url = `https://plugins.flockler.com/embed/iframe/${m[1]}/${embed}`;
  const label = ($(el).find('[aria-label]').first().attr('aria-label') || '').trim();
  const text = label.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const title = text ? `<p>${text}</p>` : '';
  return ctx.block('embed', ['flockler'], [[`${title}<p><a href="${url}">${url}</a></p>`]]);
}
