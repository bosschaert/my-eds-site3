/**
 * video-player — the source AdmiralCloud video content element (c-media__embed.is-video:
 * figure.c-image > 16:9 frame > video.js player, figcaption creator line), alone or as one
 * column of an o-container.has-columns row (the text column beside it).
 *
 * Content: one row, one cell per column (source order).
 *   video cell — <p><picture|img></p> poster, <p><a href="https://player.admiralcloud.com/?v=<id>">
 *                URL</a></p> (the player link, text = href), then caption / creator <p>s;
 *   text cell  — any other cell: rich text (+ headings) of the neighbouring column.
 * Variants (columns >= 1023 / 767): narrow (video col-md-4, 4/8) | wide (col-md-8, 8/4) |
 *   half (col-sm-6, 50/50) | video-right (video column second) | video-last-mobile (order-2).
 *   gallery (rows = cards [heading, video, text], grid cols-3 / cols-4 / cols-2 — media library).
 * Behaviour (live pre-play state → player on demand, D3 embed): poster + big play button; a click
 * loads https://player.admiralcloud.com/acplayer.js and mounts `new AcPlayer({ container, link })`
 * in the frame (live inline script parameters); the poster comes back when the vendor cannot load
 * or refuses the host (no media element after 8s).
 * @ew-exempt player link paragraph — the URL-display link is the embed's source (hidden, kept).
 * Template-slotted decode: authored nodes are MOVED into the slots (EW1), re-entrant (EW9).
 */
const PLAYER_JS = 'https://player.admiralcloud.com/acplayer.js';
const ID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function playerLink(cell) {
  return [...cell.querySelectorAll('a[href]')].find((a) => ID.test(a.href)
    && (/admiralcloud\.com/.test(a.hostname) || a.textContent.trim() === a.getAttribute('href')));
}

async function play(stage, id) {
  if (stage.classList.contains('is-loading') || stage.classList.contains('has-started')) return;
  stage.classList.add('is-loading');
  try {
    const { loadScript } = await import('../../scripts/aem.js');
    await loadScript(PLAYER_JS);
    if (typeof window.AcPlayer !== 'function') throw new Error('AcPlayer unavailable');
    const container = el('div', 'video-player-vendor ac-player');
    stage.append(container);
    const player = new window.AcPlayer({ container, doNotModifyMetaTags: true, link: id });
    stage.classList.add('has-started');
    // the vendor refuses hosts it does not allow (403 on the player config — owner allowlist,
    // dynamic-features row 9): no media element after 8s → back to the poster
    setTimeout(() => {
      if (container.querySelector('video, iframe')) return;
      container.remove();
      stage.classList.remove('has-started');
      stage.classList.add('is-unavailable');
    }, 8000);
    const api = player && typeof player.api === 'function' ? player.api() : null;
    if (api && typeof api.ready === 'function') {
      api.ready(() => {
        if (typeof api.play === 'function') api.play();
      });
    }
  } catch (e) {
    stage.querySelector('.video-player-vendor')?.remove();
    stage.classList.remove('has-started');
    // eslint-disable-next-line no-console
    console.warn('video-player: AdmiralCloud player not available', e);
  } finally {
    stage.classList.remove('is-loading');
  }
}

function videoColumn(cell, link) {
  const id = link.href.match(ID)[0];
  const figure = el('figure', 'video-player-figure');
  const frame = el('div', 'video-player-frame');
  const stage = el('div', 'video-player-stage');
  const poster = el('div', 'video-player-poster');
  const source = el('div', 'video-player-source');
  const caption = el('figcaption', 'video-player-caption');
  const lines = [];
  stage.dataset.acPlayer = id;
  const linkP = link.closest('p') || link;
  source.append(linkP);
  [...cell.childNodes].forEach((child) => {
    let node = child;
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return;
      const p = el('p');
      node.replaceWith(p);
      p.append(node);
      node = p;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('picture, img') || node.querySelector('picture, img')) {
      if (!poster.childNodes.length) poster.append(node);
      return;
    }
    if (node.textContent.trim()) lines.push(node);
  });
  const btn = el('button', 'video-player-play');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Play Video');
  btn.addEventListener('click', () => play(stage, id));
  stage.append(poster, btn, source);
  frame.append(stage);
  figure.append(frame);
  if (lines.length) {
    // source figcaption: description span, then the creator line (c-image__creator)
    const creator = el('div', 'video-player-creator');
    creator.append(lines.pop());
    if (lines.length) {
      const text = el('div', 'video-player-caption-text');
      text.append(...lines);
      caption.append(text);
    }
    caption.append(creator);
    figure.append(caption);
  }
  const col = el('div', 'video-player-media');
  col.append(figure);
  return col;
}

// source a.c-button--* inside running text (encoded <strong><a> by button.mjs; the pipeline may
// merge it into the paragraph's <strong>) stays an inline c-button — EDS decorateButtons only
// converts links that are alone in their paragraph. Links to the source host not migrated yet
// (absolute www.continental.com) keep the source's internal arrow.
function inlineButtons(col) {
  col.querySelectorAll('p strong > a[href]').forEach((a) => {
    const strong = a.parentElement;
    const p = a.closest('p');
    if (strong.children.length !== 1 || strong.textContent.trim() !== a.textContent.trim()) return;
    if (!p || p.textContent.trim() === a.textContent.trim()) return;
    const href = a.getAttribute('href');
    let kind = 'is-internal';
    if (/^mailto:/i.test(href)) kind = 'is-mail';
    else if (/\.(pdf|zip)$/i.test(href)) kind = 'is-download';
    else if (/^https?:/i.test(href)) {
      const { host } = new URL(href);
      if (host !== window.location.host && !/(^|\.)continental\.com$/.test(host)) kind = 'is-external';
    }
    a.classList.add('c-button', kind);
  });
}

function textColumn(cell) {
  const col = el('div', 'video-player-text s-richtext');
  [...cell.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
    col.append(node);
  });
  inlineButtons(col);
  return col;
}

// gallery variant (cluster-content video-gallery.mjs): one card per row — [heading cell, video
// cell, text cell] stacked in a `.video-player-card` grid cell (source col-sm-6 col-md-4 mb-5)
function galleryCards(block) {
  const cards = [...block.children].map((row) => {
    const card = el('div', 'video-player-card');
    [...row.children].forEach((cell) => {
      const col = el('div', 'video-player-column');
      const link = playerLink(cell);
      col.append(link ? videoColumn(cell, link) : textColumn(cell));
      if (link) col.classList.add('is-video');
      card.append(col);
    });
    return card;
  });
  block.replaceChildren(...cards);
}

export default function decorate(block) {
  if (block.querySelector('.video-player-column')) return;
  if (block.classList.contains('gallery')) {
    galleryCards(block);
    return;
  }
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const cols = cells.map((cell) => {
    const col = el('div', 'video-player-column');
    const link = playerLink(cell);
    col.append(link ? videoColumn(cell, link) : textColumn(cell));
    if (link) col.classList.add('is-video');
    return col;
  });
  [...block.children].forEach((row) => row.remove());
  block.classList.toggle('has-columns', cols.length > 1);
  block.append(...cols);
}
