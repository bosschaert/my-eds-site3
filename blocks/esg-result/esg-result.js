/**
 * esg-result — ESG > Highlights composition (source sub.css .sub_cont.esg_result_new).
 * Decode tier: template-slotted (fixed composition; one row per panel, in order):
 *   0 tabs            ul of links (strong = current tab)
 *   1 intro           h4 (title image) + paragraphs            -> Green Innovation
 *   2 roadmap         ul + caption p + goal p                  -> GHG map
 *   3 intro           h4 + paragraphs                          -> Proud Workplace
 *   4 process         h5, (p + ol) x2, stat p, note p          -> EHS risk management
 *   5 statement       h4 + paragraphs                          -> Human Rights Management
 *   6 cards           ul of (picture + text)                   -> human-rights commitments
 *   7 intro           h4 + paragraphs                          -> Responsible Growth
 *   8 cycle           h5, (p + ul) x3, links p                 -> supplier assessment
 *   9 banner          h5, picture, title p, text p, CTA p      -> Social Responsibility
 *  10 intro           h4 + paragraphs                          -> Do the right thing
 *  11 lists           (h5 + ul) x2                             -> governance / ethics
 *  12 diagram         h5, picture, text p, (p + ul) x6         -> Compliance
 *  13 channels        h5, p, ul of (picture + strong + text)   -> Whistle Blowing
 * Authored nodes are MOVED into empty slot containers by role; text is never
 * rebuilt. A row an author omits leaves its slot out; extra elements land in
 * the panel's last slot (leftovers pass), never dropped.
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** wrap an authored element's child nodes in one presentational span (nodes moved) */
function wrapInner(node, className) {
  if (node.querySelector(':scope > span.wrap')) return node.firstElementChild;
  const span = el('span', className ? `wrap ${className}` : 'wrap');
  span.append(...node.childNodes);
  node.append(span);
  return span;
}

/** split an element's nodes at <br> into block spans (source: a > span + span) */
function splitAtBreaks(node) {
  const runs = [[]];
  [...node.childNodes].forEach((n) => {
    if (n.nodeName === 'BR') {
      runs.push([]);
      n.remove();
    } else runs[runs.length - 1].push(n);
  });
  runs.filter((r) => r.length).forEach((r) => {
    const span = el('span', 'line');
    span.append(...r);
    node.append(span);
  });
}

/** wrap the loose text nodes that follow a leading picture/strong in a li */
function wrapTrailingText(li, className) {
  const loose = [...li.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE
    || (n.nodeType === Node.ELEMENT_NODE && !n.matches('picture, img, strong, b')));
  const span = el('span', className);
  span.append(...loose);
  li.append(span);
  return span;
}

const reveal = (node) => {
  node.classList.add('con-ani', 'fade-up');
  return node;
};

function slot(className, ...children) {
  const node = el('div', className);
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return node;
}

/** consume the cell's elements in order */
function take(cell) {
  const items = [...cell.children];
  return {
    first(sel) {
      const i = items.findIndex((n) => n.matches(sel));
      return i < 0 ? null : items.splice(i, 1)[0];
    },
    all(sel) {
      const out = items.filter((n) => n.matches(sel));
      out.forEach((n) => items.splice(items.indexOf(n), 1));
      return out;
    },
    rest: () => items.splice(0),
  };
}

function inner(...children) {
  return reveal(slot('inner', ...children));
}

function article(className, ...children) {
  const node = el('article', className);
  children.flat().filter(Boolean).forEach((c) => node.append(c));
  return reveal(node);
}

/** h4 + paragraphs -> .esg-result-new-01 */
function intro(cell) {
  const t = take(cell);
  const title = t.first('h1, h2, h3, h4, h5, h6');
  const ps = t.all('p');
  const lead = article('arti-01');
  ps.forEach((p, i) => {
    if (i) lead.append(document.createTextNode(' '));
    lead.append(p);
  });
  lead.append(...t.rest());
  return { box: inner(title, lead), wrap: slot('esg-result-new-01') };
}

function tabs(cell) {
  const nav = el('nav', 'sub-tab', { 'aria-label': 'ESG' });
  nav.append(...cell.children);
  const current = nav.querySelector('strong a');
  if (current) current.setAttribute('aria-current', 'page');
  return inner(nav);
}

function roadmap(cell) {
  const t = take(cell);
  const list = t.first('ul, ol');
  if (list) list.querySelectorAll('li').forEach((li) => wrapInner(li));
  const [caption, goal, ...more] = t.all('p');
  return article(
    'arti-02',
    slot(
      'map',
      slot('map-list', list),
      slot('map-caption', caption),
      slot('circle', goal),
      more,
      t.rest(),
    ),
  );
}

function process(cell) {
  const t = take(cell);
  const title = t.first('h1, h2, h3, h4, h5, h6');
  const wrap = slot('pro-wrap');
  let n = 0;
  const nodes = t.rest();
  const leftovers = [];
  nodes.forEach((node, i) => {
    const next = nodes[i + 1];
    if (node.matches('p') && next && next.matches('ol, ul')) {
      n += 1;
      next.querySelectorAll('li').forEach((li) => wrapInner(li));
      wrap.append(slot(`pro pro-0${n}`, slot('pro-head', node), next));
    } else if (!node.matches('ol, ul') || !nodes[i - 1] || !nodes[i - 1].matches('p')) {
      leftovers.push(node);
    }
  });
  const stat = leftovers.find((p) => p.matches('p') && p.querySelector('strong, b'));
  if (stat) wrap.append(slot('pro pro-03', slot('pro-stat', stat)));
  const notes = leftovers.filter((p) => p !== stat);
  return slot('esg-result-new-03', inner(title, wrap, notes.length ? slot('txt-info', notes) : null));
}

function statement(cell) {
  return inner(...cell.children);
}

function cards(cell) {
  const list = cell.querySelector('ul, ol');
  if (list) {
    list.querySelectorAll(':scope > li').forEach((li) => {
      const pic = li.querySelector('picture, img');
      const text = wrapTrailingText(li, 'card-text');
      li.replaceChildren(slot('img-box', pic), text);
    });
  }
  return article('arti-01 esg-result-new-04', slot('inner esg-new', slot('conts', ...cell.children)));
}

function cycle(cell) {
  const t = take(cell);
  const title = t.first('h1, h2, h3, h4, h5, h6');
  const nodes = t.rest();
  const groups = [];
  const leftovers = [];
  nodes.forEach((node, i) => {
    const next = nodes[i + 1];
    if (node.matches('p') && !node.querySelector('a') && next && next.matches('ul, ol')) {
      next.querySelectorAll('li').forEach((li) => wrapInner(li));
      // the <br> hides <= 1024px: keep a word gap where the author's space was trimmed
      node.querySelectorAll('br').forEach((br) => {
        const prev = br.previousSibling;
        if (prev && prev.nodeType === Node.TEXT_NODE && !/\s$/.test(prev.textContent)) {
          br.before(document.createTextNode(' '));
        }
      });
      groups.push([slot('eval-head', node), next]);
    } else if (!(node.matches('ul, ol') && groups.length && groups[groups.length - 1][1] === node)) {
      leftovers.push(node);
    }
  });
  const links = leftovers.filter((p) => p.querySelector('a'));
  links.forEach((p) => {
    p.querySelectorAll('a').forEach((a) => splitAtBreaks(a));
    [...p.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      .forEach((n) => {
        const span = el('span', 'joiner');
        n.replaceWith(span);
        span.append(n);
      });
  });
  const evalBox = slot('esg-eval');
  if (groups[0]) evalBox.append(slot('esg-eval-title', groups[0]));
  if (groups.length > 1) {
    evalBox.append(slot(
      'esg-eval-02-03-wrap',
      groups[1] ? slot('esg-eval-02', groups[1]) : null,
      groups[2] ? slot('esg-eval-03', groups[2]) : null,
    ));
  }
  evalBox.append(slot(
    'esg-eval-link',
    slot('esg-eval-link-bg', links),
    leftovers.filter((n) => !links.includes(n)),
  ));
  return slot('esg-result-new-02', inner(title, evalBox));
}

function banner(cell) {
  const t = take(cell);
  const title = t.first('h1, h2, h3, h4, h5, h6');
  const bg = cell.querySelector('picture, img') ? t.first('p:has(picture, img), picture, img') : null;
  const cta = t.first('p:has(a)');
  const [head, ...desc] = t.all('p');
  const box = slot(
    'banner',
    bg ? slot('banner-bg', bg) : null,
    slot('banner-title', head),
    desc.length ? slot('banner-desc', desc) : null,
    cta ? slot('btn-wrap', cta) : null,
    t.rest(),
  );
  return article('arti-02 esg-result-0202', slot('inner', title, box));
}

function lists(cell) {
  const nodes = [...cell.children];
  const wrap = slot('list-wrap');
  let current = null;
  let n = 0;
  nodes.forEach((node) => {
    if (node.matches('h1, h2, h3, h4, h5, h6')) {
      n += 1;
      wrapInner(node);
      current = slot(`list list-0${n}`, node);
      wrap.append(current);
    } else {
      if (node.matches('ul, ol')) {
        node.querySelectorAll(':scope > li').forEach((li) => wrapTrailingText(li, 'item-desc'));
      }
      if (!current) {
        current = slot('list list-01');
        wrap.append(current);
      }
      current.append(node);
    }
  });
  return slot('esg-result-new-02', inner(wrap));
}

function diagram(cell) {
  const t = take(cell);
  const title = t.first('h1, h2, h3, h4, h5, h6');
  const nodes = t.rest();
  const center = slot('keyword');
  const items = [];
  nodes.forEach((node, i) => {
    const next = nodes[i + 1];
    if (node.matches('ul, ol')) return;
    if (node.matches('p') && next && next.matches('ul, ol')) {
      items.push([slot('keyword', node), slot('list-st01 type-blue type-sm', next)]);
    } else if (node.querySelector('picture, img')) {
      center.append(slot('ico', node));
    } else {
      center.append(slot('text', node));
    }
  });
  const half = Math.ceil(items.length / 2);
  const smWrap = slot('sm-item-wrap');
  items.forEach((parts, i) => {
    smWrap.append(slot(`sm-item sm-item-0${i + 1} ${i < half ? 'left' : 'right'}`, parts));
  });
  return {
    head: inner(title),
    body: article(
      'arti-01 esg-result-0301',
      slot('inner', slot('item-wrap', slot('center-item', center), smWrap)),
    ),
  };
}

function channels(cell) {
  const t = take(cell);
  const title = t.first('h1, h2, h3, h4, h5, h6');
  const list = t.first('ul, ol');
  const lead = t.all('p');
  if (list) {
    list.querySelectorAll(':scope > li').forEach((li) => {
      const pic = li.querySelector('picture, img');
      const name = li.querySelector('strong, b');
      const desc = wrapTrailingText(li, 'text-desc');
      li.replaceChildren(slot('ico', pic), slot('text', name), desc);
    });
  }
  return article(
    'arti-02 esg-result-0302',
    slot('inner', title, slot('item-title-box', lead), slot('item-wrap', list), t.rest()),
  );
}

/** scroll reveal (source common.js .con_ani -> .on): fires on the element's
 * resting top, so nothing is captured mid-transition at a viewport seam */
function observeReveal(block) {
  const targets = block.querySelectorAll('.con-ani');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((n) => n.classList.add('on'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px 100px 0px' });
  targets.forEach((n) => io.observe(n));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .esg-result-cont')) return; // EW9 re-entrant
  const cells = [...block.querySelectorAll(':scope > div')].map((row) => row.firstElementChild || row);
  const [
    cTabs, cGi, cMap, cPw, cEhs, cHr, cCards, cRg, cCycle, cBanner, cDt, cLists, cComp, cWb,
  ] = cells;
  const cont = slot('esg-result-cont');

  if (cTabs) cont.append(tabs(cTabs));

  const gi = slot('esg-result-new-gi');
  if (cGi) {
    const { box, wrap } = intro(cGi);
    if (cMap) box.append(roadmap(cMap));
    wrap.append(box);
    gi.append(wrap);
  }
  cont.append(gi);

  const pw = slot('esg-result-new-pw');
  if (cPw) {
    const { box, wrap } = intro(cPw);
    wrap.append(box);
    pw.append(wrap);
  }
  if (cEhs) pw.append(process(cEhs));
  cont.append(pw);

  const hr = slot('esg-result-sec02');
  if (cHr) hr.append(statement(cHr));
  if (cCards) hr.append(cards(cCards));
  cont.append(hr);

  const rg = slot('esg-result-new-rg');
  if (cRg) {
    const { box, wrap } = intro(cRg);
    wrap.append(box);
    rg.append(wrap);
  }
  if (cCycle) rg.append(cycle(cCycle));
  if (cBanner) rg.append(banner(cBanner));
  cont.append(rg);

  const dt = slot('esg-result-new-dt');
  if (cDt) {
    const { box, wrap } = intro(cDt);
    wrap.append(box);
    dt.append(wrap);
  }
  if (cLists) dt.append(lists(cLists));
  cont.append(dt);

  const sec03 = slot('esg-result-sec03');
  if (cComp) {
    const { head, body } = diagram(cComp);
    sec03.append(head, body);
  }
  if (cWb) sec03.append(channels(cWb));
  cont.append(sec03);

  // leftovers: rows beyond the template keep their content at the end
  cells.slice(14).forEach((c) => cont.append(slot('inner', ...c.children)));

  block.replaceChildren(cont);
  observeReveal(block);
}
