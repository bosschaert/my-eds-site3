import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  createIcon,
  uIcon,
  throttle,
  loadChromeFragment,
  fragmentSections,
  itemLink,
} from '../../scripts/utils.js';

/**
 * Footer chrome (source: c-socialmedia-list band + o-footer + scroll-to-top).
 * Content: /<locale>/footer — section 1 = social band (label + link list), then one
 * section per link column (label paragraph + list), last section = copyright line.
 * The social band is placed before <footer> (the source's footer element holds only
 * the link columns); authored nodes are moved, never copied.
 */

const el = (tag, className, ...children) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  children.filter(Boolean).forEach((c) => node.append(c));
  return node;
};

const SOCIAL = ['facebook', 'tiktok', 'youtube', 'instagram', 'linkedin', 'glassdoor',
  'xing', 'kununu', 'rss', 'x', 'reddit', 'tumblr'];

function socialName(a) {
  const label = a.textContent.trim().toLowerCase();
  if (SOCIAL.includes(label)) return label;
  const host = new URL(a.href, window.location).hostname;
  return SOCIAL.find((s) => host.includes(`${s}.`)) || (/rss/.test(a.href) ? 'rss' : null);
}

function isExternal(a) {
  const url = new URL(a.href, window.location);
  return url.origin !== window.location.origin && !/(^|\.)continental\.com$/.test(url.hostname);
}

function buildSocial(section) {
  const label = section.querySelector(':scope > p');
  const list = section.querySelector(':scope > ul');
  const band = el('section', 'social-band');
  const container = el('div', 'social-band-container container');
  const row = el('div', 'row');
  const labelCol = el('div', 'social-band-label-col');
  if (label) {
    label.className = 'social-band-label';
    labelCol.append(label);
  }
  const content = el('div', 'social-band-content');
  if (list) {
    list.className = 'social-band-list';
    [...list.children].forEach((li) => {
      li.className = 'social-band-item';
      const a = itemLink(li);
      if (!a) return;
      if (a.parentElement !== li) a.parentElement.replaceWith(a);
      a.className = 'social-band-link';
      if (!a.title) a.title = a.textContent.trim();
      if (isExternal(a)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      const name = socialName(a);
      const text = el('span', 'social-band-text');
      while (a.firstChild) text.append(a.firstChild);
      a.append(uIcon(name || 'link-external', `mr-1 is-${name || 'link'}`), text);
    });
    content.append(list);
  }
  row.append(labelCol, content);
  container.append(row);
  band.append(container);
  return band;
}

function buildColumn(section, index, total) {
  const header = section.querySelector(':scope > p');
  const list = section.querySelector(':scope > ul');
  const wide = total === 4 && index === 3;
  const col = el('div', `footer-col${wide ? ' is-wide' : ''}`);
  const sec = el('div', `footer-nav-section${index === total - 1 ? ' is-last' : ''}`);
  const content = el('div', 'footer-nav-content');
  if (header) {
    header.className = 'footer-nav-header';
    const pm = el('span', 'u-icon-plus-minus');
    const icon = el('i', 'footer-nav-icon u-icon has-bg', pm);
    header.append(icon);
    header.addEventListener('click', () => {
      if (window.innerWidth >= 767) return;
      content.classList.toggle('is-visible');
      pm.classList.toggle('is-active');
    });
    sec.append(header);
  }
  if (list) {
    list.className = 'c-list-clean';
    [...list.children].forEach((li) => {
      const a = itemLink(li);
      if (a && a.parentElement !== li) a.parentElement.replaceWith(a);
      if (a && !a.title) a.title = a.textContent.trim();
      if (a && isExternal(a)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.append(' ', uIcon('link-external', 'is-xs ml-1'));
      }
    });
    content.append(list);
  }
  sec.append(content);
  col.append(sec);
  return col;
}

function buildScrollTop() {
  const button = el(
    'button',
    'scroll-to-top',
    el('span', 'scroll-to-top-icon', createIcon('chevron-down')),
  );
  button.type = 'button';
  button.setAttribute('aria-label', 'Scroll to top');
  button.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  const check = () => button.classList.toggle('is-visible', window.innerHeight < window.scrollY);
  window.addEventListener('scroll', throttle(check, 300));
  check();
  return button;
}

export default async function decorate(block) {
  const fragment = await loadChromeFragment('footer', getMetadata('footer'), loadFragment);
  if (!fragment) return;
  const sections = fragmentSections(fragment);
  const social = sections.find((s) => s.querySelector(':scope > p > strong'));
  const rest = sections.filter((s) => s !== social);
  const columns = rest.filter((s) => s.querySelector(':scope > ul'));
  const copyright = rest.filter((s) => !s.querySelector(':scope > ul')).pop();

  const nav = el('div', 'row footer-nav');
  columns.forEach((s, i) => nav.append(buildColumn(s, i, columns.length)));
  const content = el('div', 'footer-content container', nav);
  if (copyright) {
    const p = copyright.querySelector('p') || copyright;
    p.className = 'footer-copyright';
    content.append(p);
  }
  block.replaceChildren(content, buildScrollTop());

  const host = block.closest('footer');
  if (social && host) host.before(buildSocial(social));
}
