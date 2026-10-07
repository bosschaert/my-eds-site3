/**
 * media-cells — a row of media cards (image or YouTube video), the source's
 * layout-table band. Schema: stardust/eds-schema/index.json sections 0–1
 * (2 × media-cells__cell per instance). Decode tier: template-slotted — the
 * composition is fixed (one card per authored cell), nothing is re-segmented.
 *
 * Authoring: ONE row, one cell per image (≤ 4), each an <img> (editorial,
 * content.da.live URL). Variant `video`: the player is NOT a table cell (D1 —
 * embed URLs stay plain links in default content): author the YouTube embed URL
 * (https://www.youtube.com/embed/<id>) as a bare link paragraph directly before
 * the table, in the same section; decorate() adopts that paragraph as the first
 * cell (27fr / 67fr split, lifted from the source's auto table layout). A link
 * authored inside a cell is tolerated as a decode fallback.
 *
 * @ew-exempt <a> YouTube embed URL (video variant) — source link rendered as the
 *   <iframe>; text-as-metadata (EW5 a).
 */

const YT = /^https?:\/\/(www\.)?(youtube\.com\/embed\/|youtu\.be\/|youtube-nocookie\.com\/embed\/)/;

function toIframe(link) {
  const iframe = document.createElement('iframe');
  iframe.width = '560';
  iframe.height = '315';
  iframe.src = link.href;
  iframe.title = 'YouTube video';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  );
  iframe.setAttribute('allowfullscreen', '');
  return iframe;
}

/**
 * The video variant's player link lives in the section's default content just
 * before the block: move its paragraph (EW8) into a generated first cell.
 */
function adoptVideoLink(block) {
  const prev = block.parentElement ? block.parentElement.previousElementSibling : null;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const link = [...prev.querySelectorAll('p > a[href]')].reverse()
    .find((a) => YT.test(a.href) && a.parentElement.children.length === 1);
  if (!link) return null;
  const cell = document.createElement('div');
  cell.append(link.closest('p'));
  if (!prev.children.length) prev.remove();
  return cell;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (block.classList.contains('video')) {
    const adopted = adoptVideoLink(block);
    if (adopted) cells.unshift(adopted);
  }
  cells.forEach((cell) => {
    cell.className = 'media-cells-cell';
    const link = cell.querySelector('a[href]');
    if (link && YT.test(link.href) && !cell.querySelector('picture, img')) {
      // The authored link is config (EW5): the player replaces the anchor; its
      // paragraph stays as the host (identity kept, the URL stays editable).
      link.replaceWith(toIframe(link));
      cell.classList.add('media-cells-video');
    }
  });
  // Flatten row → cells so the block itself is the grid (the authored nodes
  // move with their cell; the emptied row divs go).
  block.replaceChildren(...cells);
}
