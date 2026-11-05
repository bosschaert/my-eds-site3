/**
 * town-map — the illustrated town map
 * (blocks/town-map/town-map.svg, presentational artwork with the
 * 12 project pins; their yellow labels are drawn into the artwork and slide in on hover).
 * Rows: one pin each, in pin order — a link whose href becomes that pin's target and whose text is
 * the pin's name. The authored paragraphs are moved into a visually-hidden list that names the
 * pins for assistive tech; the drawn labels stay artwork.
 */

const ART = 'town-map.svg';

function codeBase() {
  return (window.hlx && window.hlx.codeBasePath) || '';
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .town-map-art')) return;

  const labels = document.createElement('div');
  labels.className = 'town-map-labels';
  const hrefs = [];
  [...block.children].forEach((row) => {
    const link = row.querySelector('a[href]');
    hrefs.push(link ? link.getAttribute('href') : '');
    [...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol')].forEach((el) => {
      if (!el.parentElement.closest('p, ul, ol')) labels.append(el);
    });
    row.remove();
  });

  const art = document.createElement('div');
  art.className = 'town-map-art';
  block.append(art, labels);

  try {
    const resp = await fetch(`${codeBase()}/blocks/town-map/${ART}`);
    if (!resp.ok) return;
    const svg = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml').documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') return;
    art.append(document.importNode(svg, true));
    hrefs.forEach((href, i) => {
      const pin = art.querySelector(`.map-pin.pin-${i + 1}`);
      if (pin && href) pin.setAttribute('href', href);
    });
  } catch (e) {
    // the artwork is decorative: the labelled links stay available without it
  }
}
