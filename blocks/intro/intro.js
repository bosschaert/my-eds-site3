/**
 * intro — centred 60% prose column under a yellow-ruled section heading.
 * Replica of balbriggan.ie `.intro` (20/60/20 columns, 2em gap on the source).
 *
 * Schema: stardust/eds-schema/index.json → sections[1] (heading, body, body).
 * Decode tier: template-slotted. A block (not default content) because its layout lives in
 * block CSS — the foundation styles are frozen.
 *
 * Authoring: <h2> heading, then any number of paragraphs/lists (moved in authored order).
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    // HARNESS-ONLY fallback (EW5): bare text cell — move its text nodes into a <p>
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const body = document.createElement('div');
  body.className = 'intro-body';
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) {
    const title = document.createElement('div');
    title.className = 'intro-title';
    title.append(heading);
    body.append(title);
  }
  nodes.filter((n) => n !== heading).forEach((n) => body.append(n));
  block.replaceChildren(body);
}
