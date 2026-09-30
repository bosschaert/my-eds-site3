/**
 * map — the town-transformation project map: the captured inline SVG composition
 * (blocks/map/map.svg — the source's `.map-wrap svg` with its 12 photo pins, fetched and
 * inlined so the theme's pin/label CSS applies; template `section.section-map`,
 * index-proposed.css § Map) with the authored project list slotted onto it: each authored
 * link's href goes to the matching pin anchor (`#projectN` ↔ `.pin-N`) and its text lines
 * (authored <br>) fill that pin's label <text>.
 *
 * Decode tier: template-slotted (a fixed composition). The authored <ul> is MOVED into the
 * block as the map's legend (EW1 — it is the editable element; visually hidden once the SVG
 * is in, shown as the no-SVG fallback); the SVG labels are its derived rendering (EW5 b,
 * not instrumented — the authored list keeps the index).
 */
function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** the authored link's text split at its <br> line breaks */
function linesOf(link) {
  const lines = [''];
  link.childNodes.forEach((n) => {
    if (n.nodeType === 1 && n.tagName === 'BR') lines.push('');
    else lines[lines.length - 1] += n.textContent;
  });
  return lines.map((l) => l.replace(/\s+/g, ' ').trim()).filter((l, i) => l || i === 0);
}

/** fills the pin's <text>: leading text = line 1, each positioned tspan = one more line */
function setLabel(pin, lines) {
  const text = pin.querySelector('text');
  if (!text) return;
  const slots = [...text.querySelectorAll('tspan[x]')];
  [...text.childNodes].forEach((n) => {
    if (n.nodeType === 3) n.remove();
  });
  text.prepend(document.createTextNode(lines[0] || ''));
  slots.forEach((t, i) => {
    t.textContent = lines[i + 1] || '';
  });
  if (lines.length > slots.length + 1 && slots.length) {
    const last = slots[slots.length - 1];
    lines.slice(slots.length + 1).forEach((line, k) => {
      const extra = last.cloneNode(false);
      extra.setAttribute('y', String(parseFloat(last.getAttribute('y') || '0') * (k + 2)));
      extra.textContent = line;
      last.parentNode.append(extra);
    });
  }
}

function slotPins(svg, list) {
  list.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a[href]');
    if (!link) return;
    const m = (link.getAttribute('href') || '').match(/#project(\d+)/);
    if (!m) return;
    const pin = svg.querySelector(`.pin-${m[1]}`);
    if (!pin) return;
    pin.setAttribute('href', link.href);
    setLabel(pin, linesOf(link));
  });
}

async function loadSvg() {
  const base = (window.hlx && window.hlx.codeBasePath) || '';
  const resp = await fetch(`${base}/blocks/map/map.svg`);
  if (!resp.ok) throw new Error(`map.svg ${resp.status}`);
  const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) throw new Error('map.svg: no <svg>');
  return document.importNode(svg, true);
}

export default async function decorate(block) {
  const list = block.querySelector('ul, ol');
  const legend = el('div', 'map-legend');
  if (list) legend.append(list);
  // leftovers: any other authored element stays visible beside the legend
  block.querySelectorAll(':scope > div > div > *').forEach((n) => legend.append(n));
  const wrap = el('div', 'map-wrap');
  block.replaceChildren(wrap, legend);
  try {
    const svg = await loadSvg();
    if (list) slotPins(svg, list);
    wrap.append(svg);
    block.classList.add('map-loaded');
  } catch (e) {
    // no SVG (offline harness, asset missing): the legend list stays visible
    block.classList.remove('map-loaded');
  }
}
