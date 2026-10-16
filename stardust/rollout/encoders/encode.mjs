#!/usr/bin/env node
/**
 * encode.mjs — captured TYPO3 page → DA content document (continental.com → EDS).
 *
 *   node stardust/rollout/encoders/encode.mjs <slug> [--out content] [--stdout]
 *
 * Reads stardust/current/pages/<slug>.html (hydrated capture) + <slug>.json (title, og, url) and
 * writes <out>/<eds-path>.html. EDS path = the source URL path without trailing slash; the root
 * `/` (slug `index`) → <out>/index.html. Every string is copied verbatim from the capture.
 *
 * Walk (in document order):
 *   - every child of <main> opens a SECTION. A `.o-container` maps its ground class to the
 *     section-metadata Style (is-white → none; is-lightgray, is-yellow, is-pastel-* , has-image
 *     kept); any other top-level element (hero, stage) is a section of its own.
 *   - inside a section each element is tried against the MODULES (encoders/modules/*.mjs,
 *     highest `priority` first, then file name). The first module whose `match` selector matches
 *     the element and whose encode() returns non-null wins; its output is emitted and the element
 *     is not descended into.
 *   - no module: content tags (h1-h6, p, ul, ol, table, blockquote) with no layout/widget markup
 *     inside (div, form, button, iframe, video …) → default content (cleaned);
 *     ignorable / empty elements are skipped; layout wrappers (div, header, section, …, with no
 *     direct text) are descended into; anything else → `UNMAPPED <tag.class>` on stderr.
 *   - the last section closes with the `metadata` block (Title, Description, Image = og:image).
 * Any UNMAPPED element → nothing written, exit 2 (fix by adding a module file). Usage error → 1.
 *
 * Module file contract (encoders/modules/<block>.mjs — later units only ADD files here):
 *   export const match = '<css selector>';           // cheerio selector, tested with el.is()
 *   export const priority = 0;                        // optional; higher is tried first
 *   export function encode(el, ctx) { … }             // el = cheerio element
 *     returns null (not mine — keep walking), an HTML string, or
 *     { html, sectionStyle?: 'a, b' }  (sectionStyle is merged into the section's Style).
 * ctx: { $, slug, page, url, block(name, variants, rows), clean(el), cleanChildren(el), img(el),
 *        pictureImgs(picture), abs(url), walk(el) → html of el's children through the normal
 *        dispatch (default content + modules), warn(msg) }.
 *   block(): rows = [[cellHtml, …], …] → `<div class="name v1 v2"><div><div>…</div></div></div>`.
 *   clean(): outer HTML of a content element with only href/title (a), src/alt (img),
 *            colspan/rowspan (td/th) kept; spans unwrapped; icons/svg/scripts dropped;
 *            <picture> → <img src alt>; relative URLs made absolute to the source page.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const cheerio = require('cheerio');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const PAGES = path.join(ROOT, 'stardust/current/pages');

const CONTENT_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'table', 'blockquote']);
const WRAPPER_TAGS = new Set(['div', 'header', 'section', 'article', 'aside', 'span', 'figure', 'main']);
const IGNORE = 'script, style, noscript, template, link, meta, svg, .c-image__tools, .t3js-icon, .u-icon';
const STRUCTURAL = 'div, section, article, form, input, select, button, iframe, video, audio';
const SECTION_SEL = '.o-container';
const GROUNDS = ['is-yellow', 'is-lightgray', 'is-pastel-yellow', 'is-pastel-red', 'is-pastel-blue',
  'is-pastel-green', 'has-image'];
const KEEP_ATTRS = { a: ['href', 'title'], img: ['src', 'alt'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan'] };

function usage(msg) {
  process.stderr.write(`encode: ${msg}\nusage: node encode.mjs <slug> [--out content] [--stdout]\n`);
  process.exit(1);
}

async function loadModules() {
  const dir = path.join(HERE, 'modules');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort();
  const mods = [];
  for (const f of files) {
    // eslint-disable-next-line no-await-in-loop
    const m = await import(pathToFileURL(path.join(dir, f)).href);
    if (!m.match || typeof m.encode !== 'function') usage(`module ${f} lacks match/encode`);
    mods.push({ name: f.replace(/\.mjs$/, ''), match: m.match, priority: m.priority || 0, encode: m.encode });
  }
  return mods.sort((a, b) => b.priority - a.priority);
}

export function edsPath(url) {
  const p = new URL(url).pathname.replace(/\/+$/, '');
  return p === '' ? '/index' : p;
}

function makeCtx($, slug, page, modules, unmapped) {
  const base = page.finalUrl || page.url;
  const abs = (u) => {
    if (!u || /^(mailto:|tel:|#|javascript:)/i.test(u)) return u;
    try { return new URL(u, base).href; } catch { return u; }
  };
  const firstSrc = (srcset) => (srcset || '').trim().split(/\s+/)[0] || '';
  const imgHtml = (src, alt) => `<img src="${abs(src).replace(/"/g, '&quot;')}" alt="${(alt || '').replace(/"/g, '&quot;')}">`;

  // <picture> → [img for each <source> in order, then the fallback img] (art direction kept)
  const pictureImgs = (pic) => {
    const p = $(pic);
    const fallback = p.find('img').first();
    const alt = fallback.attr('alt') || '';
    const out = p.find('source').map((i, s) => {
      const src = firstSrc($(s).attr('srcset') || $(s).attr('data-srcset'));
      return src ? imgHtml(src, alt) : null;
    }).get().filter(Boolean);
    const fsrc = fallback.attr('src') || fallback.attr('data-src');
    if (fsrc) out.push(imgHtml(fsrc, alt));
    return out;
  };
  const img = (el) => {
    const e = $(el);
    const i = e.is('img') ? e : e.find('img').first();
    if (!i.length) return '';
    return imgHtml(i.attr('src') || i.attr('data-src'), i.attr('alt'));
  };

  const cleanNode = (node) => {
    const n = $(node);
    n.find(IGNORE).remove();
    n.find('picture').each((i, p) => { $(p).replaceWith(img(p)); });
    const all = [n.get(0), ...n.find('*').get()];
    for (const e of all) {
      const tag = e.tagName;
      const keep = KEEP_ATTRS[tag] || [];
      for (const a of Object.keys(e.attribs || {})) {
        if (!keep.includes(a)) $(e).removeAttr(a);
      }
      if (tag === 'a' && e.attribs.href) $(e).attr('href', abs(e.attribs.href));
      if (tag === 'img' && e.attribs.src) $(e).attr('src', abs(e.attribs.src));
    }
    n.find('span, font').each((i, s) => { $(s).replaceWith($(s).contents()); });
    // source-indentation whitespace at the edges of text blocks (never &nbsp;) is insignificant
    [n.get(0), ...n.find('h1, h2, h3, h4, h5, h6, p, li').get()].forEach((e) => {
      const kids = e.children || [];
      const first = kids[0];
      const last = kids[kids.length - 1];
      if (first && first.type === 'text') first.data = first.data.replace(/^[ \t\r\n]+/, '');
      if (last && last.type === 'text') last.data = last.data.replace(/[ \t\r\n]+$/, '');
    });
    return n;
  };
  const clean = (el) => $.html(cleanNode($(el).clone()));
  const cleanChildren = (el) => cleanNode($(el).clone()).html() || '';

  const block = (name, variants, rows) => {
    const cls = [name, ...(variants || [])].filter(Boolean).join(' ');
    const r = rows.map((cells) => `<div>${cells.map((c) => `<div>${c}</div>`).join('')}</div>`).join('');
    return `<div class="${cls}">${r}</div>`;
  };

  const ctx = {
    $, slug, page, url: base, abs, img, pictureImgs, clean, cleanChildren, block,
    warn: (m) => process.stderr.write(`WARN ${slug}: ${m}\n`),
  };

  const label = (el) => `${el.tagName}${(($(el).attr('class') || '').trim().split(/\s+/).filter(Boolean)
    .map((c) => `.${c}`)
    .join(''))}`;
  const isEmpty = (el) => !$(el).text().trim() && !$(el).find('img, picture, iframe, video').length;
  const hasDirectText = (el) => (el.children || []).some((c) => c.type === 'text' && c.data.trim());

  // returns { html, styles[] } for one element
  const encodeEl = (el, styles) => {
    if ($(el).is(IGNORE)) return '';
    for (const m of modules) {
      if ($(el).is(m.match)) {
        const r = m.encode(el, ctx);
        if (r !== null && r !== undefined) {
          if (typeof r === 'string') return r;
          if (r.sectionStyle) styles.push(r.sectionStyle);
          return r.html || '';
        }
      }
    }
    if (isEmpty(el)) return '';
    // a content tag holding layout / widget markup is a module, not prose → falls to UNMAPPED
    if (CONTENT_TAGS.has(el.tagName) && !$(el).find(STRUCTURAL).length) return clean(el);
    if (WRAPPER_TAGS.has(el.tagName) && !hasDirectText(el)) {
      // eslint-disable-next-line no-use-before-define
      return walkInto(el, styles);
    }
    unmapped.push(label(el));
    process.stderr.write(`UNMAPPED ${label(el)} in ${slug}\n`);
    return '';
  };
  const walkInto = (el, styles) => $(el).children().get().map((c) => encodeEl(c, styles)).join('');
  // nested walks (module → ctx.walk) feed their modules' sectionStyle into the current section
  let sectionStyles = [];
  ctx.walk = (el) => walkInto(el, sectionStyles);
  ctx.encodeSection = (el) => {
    const styles = [];
    sectionStyles = styles;
    if ($(el).is(SECTION_SEL)) {
      const cls = ($(el).attr('class') || '').split(/\s+/);
      styles.push(...GROUNDS.filter((g) => cls.includes(g)));
      return { html: walkInto(el, styles), styles };
    }
    return { html: encodeEl(el, styles), styles };
  };
  return ctx;
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith('--'));
  if (!slug) usage('missing <slug>');
  const oi = args.indexOf('--out');
  const outRoot = path.resolve(ROOT, oi >= 0 ? args[oi + 1] : 'content');
  const htmlFile = path.join(PAGES, `${slug}.html`);
  const jsonFile = path.join(PAGES, `${slug}.json`);
  if (!fs.existsSync(htmlFile) || !fs.existsSync(jsonFile)) usage(`no capture for ${slug}`);
  const page = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const $ = cheerio.load(fs.readFileSync(htmlFile, 'utf8'));
  const modules = await loadModules();
  const unmapped = [];
  const ctx = makeCtx($, slug, page, modules, unmapped);

  const sections = [];
  $('main').first().children().each((i, el) => {
    const { html, styles } = ctx.encodeSection(el);
    if (!html.trim()) return;
    const style = [...new Set(styles.join(',').split(',').map((s) => s.trim()).filter(Boolean))];
    const meta = style.length ? ctx.block('section-metadata', [], [['Style', style.join(', ')]]) : '';
    sections.push(`${html}${meta}`);
  });

  const rows = [['Title', page.title || page.og?.title || '']];
  if (page.description) rows.push(['Description', page.description]);
  if (page.og?.image) rows.push(['Image', `<img src="${ctx.abs(page.og.image)}" alt="">`]);
  // page metadata closes the LAST section (an own metadata-only section would render as an
  // empty trailing section and break the last-section padding rule)
  const metaBlock = ctx.block('metadata', [], rows);
  if (sections.length) sections[sections.length - 1] += metaBlock;
  else sections.push(metaBlock);

  if (unmapped.length) {
    process.stderr.write(`encode ${slug}: ${unmapped.length} UNMAPPED — nothing written\n`);
    process.exit(2);
  }
  const doc = `<body><header></header><main>${sections.map((x) => `<div>${x}</div>`).join('')}</main><footer></footer></body>\n`;
  const rel = `${edsPath(page.url)}.html`;
  if (args.includes('--stdout')) {
    process.stdout.write(doc);
    return;
  }
  const out = path.join(outRoot, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, doc);
  process.stdout.write(`encode ${slug} → ${path.relative(ROOT, out)} (${sections.length} sections)\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { process.stderr.write(`encode error: ${e.stack || e.message}\n`); process.exit(1); });
}
