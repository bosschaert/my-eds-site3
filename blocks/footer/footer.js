import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Footer — template-slotted chrome of current-design.jp: the prototype's `section.contact-band`
 * (marquee logo strip, title, arrow link to /contact, background photo) followed by
 * `footer.site-footer` (wave, brand + tagline, link columns, social links, address, copyright,
 * back-to-top). Authored /footer document, one section per band:
 *   1. contact band — marquee logo <img>, title <p>, contact link <p>, background <img>
 *   2. brand — logo link paragraph + tagline paragraph
 *   3..n. link columns — one <ul> per section
 *   then social links (external links), then address + copyright paragraphs.
 * Authored elements are MOVED (EW1); marquee repeats are presentational clones (EW4).
 */

const INDEX_ATTRS = ['data-prose-index', 'data-image-index', 'data-block-index'];

function stripInstrumentation(root) {
  if (root.nodeType !== Node.ELEMENT_NODE) return root;
  [root, ...root.querySelectorAll('*')].forEach((node) => {
    INDEX_ATTRS.forEach((attr) => node.removeAttribute(attr));
  });
  return root;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

const hasMedia = (node) => node.matches('picture, img') || !!node.querySelector('picture, img');

/** The paragraph (or bare node) that carries an authored image or link. */
const hostOf = (node) => node.closest('p') || node;

function buildContactBand(section) {
  const band = el('div', 'contact-band');
  const media = [...section.querySelectorAll('picture, img')]
    .filter((m) => !(m.tagName === 'IMG' && m.closest('picture')));
  const marqueeMedia = media.length > 1 ? media[0] : null;
  const bgMedia = media.length ? media[media.length - 1] : null;

  if (marqueeMedia) {
    const marquee = el('div', 'marquee', { 'aria-hidden': 'true' });
    const track = el('div', 'marquee-track');
    const first = el('div', 'marquee-slide');
    first.append(hostOf(marqueeMedia));
    track.append(first);
    for (let i = 0; i < 3; i += 1) {
      track.append(stripInstrumentation(first.cloneNode(true)));
    }
    marquee.append(track);
    band.append(marquee);
  }

  const row = el('div', 'contact-band-row');
  section.querySelectorAll('p').forEach((p) => {
    if (hasMedia(p)) return;
    const link = p.querySelector('a');
    if (link) {
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      link.classList.add('contact-band-go');
      const label = el('span', 'contact-band-label');
      label.append(...link.childNodes);
      const arrows = el('span', 'contact-band-arrows', { 'aria-hidden': 'true' });
      ['arrow_forward', 'arrow_forward'].forEach((glyph) => {
        const icon = el('span', 'mi');
        icon.textContent = glyph;
        arrows.append(icon);
      });
      link.append(label, arrows);
      p.classList.add('contact-band-link');
    } else {
      p.classList.add('contact-band-title');
    }
    row.append(p);
  });
  band.append(row, el('div', 'contact-band-scrim'));

  if (bgMedia) {
    const bg = el('div', 'contact-band-bg');
    bg.append(hostOf(bgMedia));
    band.append(bg);
  }
  return band;
}

function decorateColumn(ul) {
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    if (link.closest('p') && li.contains(link.closest('p'))) link.closest('p').replaceWith(link);
    const label = el('span', 'navlink-label');
    label.append(...link.childNodes);
    const twin = el('span', 'navlink-label navlink-label-twin', { 'aria-hidden': 'true' });
    twin.append(...[...label.childNodes].map((n) => stripInstrumentation(n.cloneNode(true))));
    link.classList.add('navlink');
    link.append(label, twin);
  });
  ul.classList.add('site-footer-col');
  return ul;
}

function buildSiteFooter(sections) {
  const siteFooter = el('div', 'site-footer');
  const wave = el('div', 'site-footer-wave', { 'aria-hidden': 'true' });
  const body = el('div', 'site-footer-body');
  const inner = el('div', 'site-footer-inner');
  const top = el('div', 'site-footer-top');
  const brand = el('div', 'site-footer-brand');
  const nav = el('div', 'site-footer-nav');
  const social = el('div', 'site-footer-social');
  const bottom = el('div', 'site-footer-bottom');

  sections.forEach((section) => {
    const lists = [...section.querySelectorAll('ul')];
    const links = [...section.querySelectorAll('a')];
    const external = links.length
      && links.every((a) => new URL(a.href).origin !== window.location.origin);
    if (lists.length) {
      lists.forEach((ul) => nav.append(decorateColumn(ul)));
    } else if (hasMedia(section)) {
      [...section.querySelectorAll('p')].forEach((p) => {
        if (!hasMedia(p)) p.classList.add('site-footer-tagline');
        brand.append(p);
      });
    } else if (external) {
      links.forEach((a) => social.append(hostOf(a)));
    } else {
      const paras = [...section.querySelectorAll('p')];
      paras.forEach((p, i) => {
        p.classList.add(i === paras.length - 1 && paras.length > 1
          ? 'site-footer-copy' : 'site-footer-address');
        bottom.append(p);
      });
    }
  });

  if (social.children.length) nav.append(social);
  top.append(brand, nav);

  const toTop = el('div', 'site-footer-totop');
  const toTopLink = el('a', 'mi', { href: '#header', 'aria-label': 'ページトップへ' });
  toTopLink.textContent = 'keyboard_arrow_up';
  toTopLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toTop.append(toTopLink);

  inner.append(top, bottom, toTop);
  body.append(inner);
  siteFooter.append(wave, body);
  return siteFooter;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  fragment.querySelectorAll('.metadata').forEach((meta) => {
    meta.closest('div:not(.metadata)')?.remove();
  });
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('img, picture'));

  // the contact band is the first section holding a background photo and a link to /contact
  const bandSection = sections.find((s) => hasMedia(s) && !s.querySelector('ul')
    && [...s.querySelectorAll('a')].some((a) => /\/contact\/?$/.test(new URL(a.href).pathname))
    && s.querySelectorAll('picture, img:not(picture img)').length > 1);
  const rest = sections.filter((s) => s !== bandSection);

  const parts = [];
  if (bandSection) parts.push(buildContactBand(bandSection));
  parts.push(buildSiteFooter(rest));
  block.replaceChildren(...parts);
}
