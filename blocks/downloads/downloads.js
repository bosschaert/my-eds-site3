/**
 * downloads — "Documents for Download": four document cards (title link + cover image, the
 * even ones flipped cover-first) and the "See All" pill (template
 * `section.document-downloads`, index-proposed.css § Documents for download).
 *
 * Decode tier: reconstructive. Rows are classified by content, never by index: a row that
 * carries a picture is a document — its heading (moved as authored, EW1) and its picture,
 * which the block wraps in a link to the heading's href (the source's figure link); a row
 * with a link and no picture is the See All CTA, moved as its paragraph (EW3); any other
 * authored element in a document row stays inside its card (leftovers pass), other rows
 * degrade to visible default content under the cards.
 */
function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** the EXISTING authored elements of one cell (#62/#104) */
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
    && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      // harness-only (EW5): a bare text node beside the image moves into a fresh <p>
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.append(n);
        return p;
      }
      return null;
    }).filter(Boolean);
  }
  if (!kids.length && cell.textContent.trim()) {
    // harness-only (EW5): a bare-text cell — its text nodes move, never copied
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

function rowNodes(row) {
  return [...row.children].flatMap(cellNodes);
}

function buildDoc(row) {
  const nodes = rowNodes(row);
  const media = nodes.find((n) => n.matches('picture, img'));
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const link = (heading && heading.querySelector('a[href]'))
    || nodes.map((n) => (n.matches('a[href]') ? n : n.querySelector('a[href]'))).find(Boolean);

  const col = el('div', 'col-auto col-doc');
  const doc = el('div', 'doc-container text-center');
  if (heading) doc.append(heading);
  const figure = el('figure');
  if (media) {
    if (link) {
      const a = el('a', null, { href: link.href });
      a.append(media);
      figure.append(a);
    } else {
      figure.append(media);
    }
  }
  nodes.filter((n) => n !== media && n !== heading).forEach((n) => doc.append(n));
  doc.append(figure);
  col.append(doc);
  return col;
}

export default function decorate(block) {
  const rows = [...block.children];
  const docRows = rows.filter((r) => r.querySelector('picture, img'));
  const ctaRows = rows.filter((r) => !docRows.includes(r) && r.querySelector('a[href]'));
  const otherRows = rows.filter((r) => !docRows.includes(r) && !ctaRows.includes(r));

  const docs = el('div', 'row row-doc-downloads justify-content-center');
  docs.append(...docRows.map(buildDoc));
  const out = [docs];
  ctaRows.forEach((r) => {
    const ctaRow = el('div', 'row see-all');
    const c = el('div', 'col align-self-center');
    rowNodes(r).forEach((n) => c.append(n));
    ctaRow.append(c);
    out.push(ctaRow);
  });
  otherRows.forEach((r) => {
    const lo = el('div', 'row');
    const c = el('div', 'col');
    rowNodes(r).forEach((n) => c.append(n));
    lo.append(c);
    out.push(lo);
  });
  block.replaceChildren(...out);
}
