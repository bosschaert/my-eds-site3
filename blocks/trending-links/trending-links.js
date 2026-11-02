/**
 * trending-links — a heading over a responsive grid of large underlined links with chevrons.
 *
 * Authoring (one cell): heading, then a bulleted list of links (one link per item).
 * Extra paragraphs are kept (shown under the heading).
 * @ew-exempt none
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

export default function decorate(block) {
  const container = wrapNode(null, 'trending-container');
  const nodes = [...block.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
    .filter((n) => !n.parentElement.closest('ul, ol'));
  nodes.forEach((n) => {
    if (n.matches('h1, h2, h3, h4, h5, h6')) container.append(wrapNode(n, 'trending-title'));
    else if (n.matches('ul, ol')) container.append(wrapNode(n, 'trending-list'));
    else if (n.textContent.trim()) container.append(wrapNode(n, 'trending-text'));
  });
  block.replaceChildren(container);
}
