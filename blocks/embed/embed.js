/**
 * embed — a third-party iframe embedded as on the source (dynamic-features embed-passthrough
 * rows), e.g. the caralegal data-protection request form (variant caralegal).
 *
 * Content: one cell, <p><a href="iframe src">src</a></p>.
 * @ew-exempt the link paragraph is the embed's source (moved into the iframe's src, kept hidden).
 * Decoration: the iframe is chrome mounted from the authored link (sandbox as on the source);
 * the link paragraph stays in the DOM, hidden. Re-entrant (EW9).
 * Variant flockler (cluster-hub flockler.mjs, dynamic-features row 18): Flockler's iframe embed of
 * the source social wall / carousel — cell <p>title</p><p><a href=iframe URL>URL</a></p> (the
 * title <p> is the frame title, hidden like the link); the frame height follows Flockler's
 * FlockerIframeResizeEvent message for its embed uuid (popups allowed: posts open on the
 * social network).
 */
function sizeFlockler(frame, href) {
  const uuid = href.split('/').filter(Boolean).pop();
  window.addEventListener('message', (e) => {
    if (e.source !== frame.contentWindow || !e.data || e.data.eventName !== 'FlockerIframeResizeEvent') return;
    if (e.data.embedUuid !== uuid || !(e.data.nativeHeight > 0)) return;
    frame.style.height = `${Math.ceil(e.data.nativeHeight)}px`;
  });
}

export default function decorate(block) {
  if (block.querySelector('iframe')) return;
  const link = block.querySelector('a[href]');
  if (!link) return;
  const frame = document.createElement('iframe');
  frame.src = link.href;
  frame.className = 'embed-frame';
  frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
  frame.setAttribute('title', link.textContent.trim());
  if (block.classList.contains('flockler')) {
    // flockler: a leading <p> without the link is the frame title (source region aria-label)
    const title = [...block.querySelectorAll('p')].find((p) => !p.contains(link));
    if (title) {
      frame.setAttribute('title', title.textContent.trim());
      title.classList.add('embed-source');
    }
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    sizeFlockler(frame, link.href);
  } else {
    frame.loading = 'lazy';
  }
  const source = link.closest('p') || link;
  source.classList.add('embed-source');
  block.append(frame);
}
