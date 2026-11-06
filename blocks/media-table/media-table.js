/**
 * media-table — one row of media cells (source: a <table> of images and a YouTube embed).
 * Authored model: one row, one cell per media item; a cell holds a picture/img, or a link
 * to a YouTube embed URL that becomes the iframe.
 * @ew-exempt embed link: the YouTube URL and its text become the iframe src/title attributes
 * (an embed has no visible authored text to move).
 * @param {Element} block The block element
 */
const EMBED_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

function youtubeEmbedUrl(href) {
  try {
    const url = new URL(href, window.location.href);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' && url.pathname.startsWith('/embed/')) return url.href;
    if (host === 'youtube.com' && url.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${url.searchParams.get('v')}`;
    }
    if (host === 'youtu.be') return `https://www.youtube.com/embed${url.pathname}`;
  } catch {
    // not a URL
  }
  return null;
}

function decorateEmbed(cell) {
  const link = [...cell.querySelectorAll('a[href]')].find((a) => youtubeEmbedUrl(a.href));
  if (!link) return;
  const iframe = document.createElement('iframe');
  iframe.width = '560';
  iframe.height = '315';
  iframe.src = youtubeEmbedUrl(link.href);
  iframe.title = link.textContent.trim() || 'YouTube video';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', EMBED_ALLOW);
  iframe.setAttribute('allowfullscreen', '');
  const holder = link.closest('p') || link;
  holder.replaceWith(iframe);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.querySelector('iframe')) decorateEmbed(cell);
      // the source's images carry width=560 height=315: those attributes drive table auto layout
      cell.querySelectorAll('img').forEach((img) => {
        img.width = 560;
        img.height = 315;
      });
      // picture wrapped in a lone paragraph: lift the picture out so the global p rule cannot apply
      cell.querySelectorAll('p > picture').forEach((picture) => {
        const p = picture.parentElement;
        if (p.children.length === 1 && !p.textContent.trim()) {
          p.replaceWith(picture);
        }
      });
    });
  });
}
