/**
 * Lightbox / modal helper (source: GLightbox on `[data-lightbox]` links).
 * openLightbox(node | {src, type}) shows a full-viewport overlay; Escape, the close
 * button and the overlay close it. `bindLightboxes(root)` wires `a[data-lightbox]`
 * and links authored to images / videos inside a block.
 */
import { createIcon } from './utils.js';

let current = null;

function close() {
  if (!current) return;
  const { container, restore, onKey } = current;
  container.classList.remove('is-open');
  document.documentElement.classList.remove('lightbox-open');
  document.removeEventListener('keydown', onKey);
  setTimeout(() => {
    if (restore) restore();
    container.remove();
  }, 300);
  current = null;
}

function mediaFor({ src, type }) {
  const kind = type || (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(src) ? 'image' : 'video');
  if (kind === 'image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    return img;
  }
  if (/\.(mp4|webm)(\?|$)/i.test(src)) {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    return video;
  }
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  iframe.title = 'Media';
  return iframe;
}

/**
 * Opens a lightbox.
 * @param {Element|{src: string, type?: string}} content a DOM node (moved in, restored
 *   to its original place on close) or a media descriptor
 * @param {object} [opts]
 * @param {string} [opts.className] extra class on the container (variant styling)
 */
export function openLightbox(content, opts = {}) {
  close();
  const container = document.createElement('div');
  container.className = `lightbox${opts.className ? ` ${opts.className}` : ''}`;
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  const slide = document.createElement('div');
  slide.className = 'lightbox-slide';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.append(createIcon('close'));

  let restore = null;
  if (content instanceof Element) {
    const marker = document.createComment('lightbox');
    content.before(marker);
    slide.append(content);
    restore = () => marker.replaceWith(content);
  } else {
    slide.append(mediaFor(content));
  }
  container.append(overlay, slide, closeBtn);
  document.body.append(container);
  document.documentElement.classList.add('lightbox-open');
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  current = { container, restore, onKey };
  requestAnimationFrame(() => container.classList.add('is-open'));
  closeBtn.focus();
}

export { close as closeLightbox };

/**
 * Wires `a[data-lightbox]` (and `a.lightbox`) links under root to open in the lightbox.
 * @param {Element} root container
 */
export function bindLightboxes(root) {
  root.querySelectorAll('a[data-lightbox], a.lightbox').forEach((a) => {
    if (a.dataset.lightboxBound) return;
    a.dataset.lightboxBound = 'true';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox({ src: a.href, type: a.dataset.lightboxType });
    });
  });
}
