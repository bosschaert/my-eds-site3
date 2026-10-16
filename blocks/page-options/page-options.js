/**
 * page-options — the source c-pageoptions bar (share toggle + share window + print).
 *
 * Content (one block, cells in any order):
 *   heading  — the share window title (source <h3>Share:</h3>)
 *   list     — <ul> of share links (<a href title>Network</a>); the network icon comes from the
 *              link host (facebook, x, linkedin, reddit, xing, tumblr) or mailto: (email).
 * Behaviour: the share icon opens the share window in the foundation lightbox (source GLightbox
 * content modal: overlay fade + zoom-in); the window's own close icon, the overlay and Escape
 * close it. The print icon calls window.print() (the source `javascript:window.print()` link).
 * Reconstructive decode: authored heading / links are MOVED (EW1), re-entrant (EW9).
 */
// icons via the foundation helper; dynamic so the block also installs where /scripts/ cannot be
// resolved (local structural harness) — there the bare icon box is used
async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '', tag = 'i') => {
      const box = document.createElement(tag);
      box.className = `u-icon ${classes}`.trim();
      const span = document.createElement('span');
      span.className = `icon icon-${name}`;
      box.append(span);
      return box;
    };
  }
}

const NETWORKS = [
  ['facebook', /facebook\./i],
  ['x', /(^|\.)x\.com|twitter\./i],
  ['linkedin', /linkedin\./i],
  ['reddit', /reddit\./i],
  ['xing', /xing\./i],
  ['tumblr', /tumblr\./i],
];

function networkOf(a) {
  const href = a.getAttribute('href') || '';
  if (/^mailto:/i.test(href)) return 'email';
  let host = '';
  try {
    host = new URL(href, window.location.href).hostname;
  } catch (e) {
    host = '';
  }
  const hit = NETWORKS.find(([, re]) => re.test(host));
  return hit ? hit[0] : '';
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default async function decorate(block) {
  if (block.querySelector('.page-options-window')) return;
  const uIcon = await iconFactory();
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...block.querySelectorAll('a[href]')];

  const win = el('div', 'page-options-window');
  win.hidden = true;
  const closer = el('div', 'is-close');
  closer.append(uIcon('close', 'has-bg is-link'));
  closer.setAttribute('role', 'button');
  closer.setAttribute('tabindex', '0');
  closer.setAttribute('aria-label', 'Close');
  win.append(closer);
  if (heading) win.append(heading);

  const list = block.querySelector('ul') || el('ul');
  list.className = 'page-options-list';
  links.forEach((a) => {
    let li = a.closest('li');
    if (!li || li.parentElement !== list) {
      li = el('li');
      li.append(a);
      list.append(li);
    }
    li.className = 'page-options-list-item';
    const net = networkOf(a);
    const label = el('div', 'd-inline-block');
    label.append(...a.childNodes);
    a.className = 'page-options-link';
    if (net !== 'email') {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    if (net) a.prepend(uIcon(net, `mr-1 is-${net} is-xs`));
    a.append(label);
  });
  win.append(list);

  const share = uIcon('share', 'page-options-item has-bg is-link');
  share.setAttribute('role', 'button');
  share.setAttribute('tabindex', '0');
  if (heading) share.setAttribute('aria-label', heading.textContent.trim());

  const print = el('a', 'page-options-item u-icon has-bg is-link');
  print.href = '#';
  print.setAttribute('aria-label', 'Print');
  print.append(...uIcon('print').childNodes);
  print.addEventListener('click', (e) => {
    e.preventDefault();
    window.print();
  });

  block.replaceChildren(share, win, print);

  let lightbox = null;
  const open = async () => {
    lightbox = lightbox || await import('../../scripts/lightbox.js');
    win.hidden = false;
    lightbox.openLightbox(win, { className: 'page-options-lightbox' });
    const observer = new MutationObserver(() => {
      if (win.parentElement === block) {
        win.hidden = true;
        observer.disconnect();
      }
    });
    observer.observe(block, { childList: true });
  };
  const close = () => {
    if (lightbox) lightbox.closeLightbox();
  };
  share.addEventListener('click', open);
  share.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
  closer.addEventListener('click', close);
  closer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      close();
    }
  });
}
