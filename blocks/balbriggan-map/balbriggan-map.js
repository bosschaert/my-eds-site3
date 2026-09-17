/**
 * Balbriggan map — fixed oversized SVG plus authored hotspot links.
 * The SVG embeds raster references and intentionally ships as a code asset.
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const figure = document.createElement('div');
  figure.className = 'map-figure';

  const image = document.createElement('img');
  image.src = '/img/balbriggan/balbriggan-map.svg';
  image.alt = 'Map of Balbriggan showing town rejuvenation project points of interest';
  image.loading = 'lazy';
  figure.append(image);

  const hotspots = document.createElement('nav');
  hotspots.className = 'map-hotspots';
  hotspots.setAttribute('aria-label', 'Balbriggan projects');
  links.forEach((link) => {
    const paragraph = link.closest('p');
    hotspots.append(paragraph || link);
  });
  figure.append(hotspots);
  block.replaceChildren(figure);
}
