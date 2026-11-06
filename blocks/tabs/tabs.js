/**
 * tabs — team tabs (source: .tabs-section with showTabSection(idx)).
 * Authored model: one row per tab; the first cell is the tab label, every further cell is
 * one team card (image, h4 name, paragraph description).
 * The label's authored paragraph (or bare text) is MOVED into the generated <button>
 * (EW7 exception: the source tab control is a button, so the label has to live in one).
 * @param {Element} block The block element
 */
function selectTab(buttons, panels, idx) {
  buttons.forEach((b, i) => {
    b.setAttribute('aria-selected', String(i === idx));
  });
  panels.forEach((p, i) => {
    p.classList.toggle('active', i === idx);
    p.hidden = i !== idx;
  });
}

function moveLabel(cell, button) {
  // MOVE the authored label: the paragraph itself when there is one (keeps it editable)
  const lone = cell.children.length === 1 && cell.firstElementChild.matches('p')
    ? cell.firstElementChild : null;
  if (lone) {
    button.append(lone);
    return;
  }
  [...cell.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
  });
  button.append(...cell.childNodes);
}

function decorateCard(cell) {
  cell.classList.add('team-card');
  cell.querySelectorAll('p > picture').forEach((picture) => {
    const p = picture.parentElement;
    if (p.children.length === 1 && !p.textContent.trim()) p.replaceWith(picture);
  });
  return cell;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .tabs-list')) return;
  const uid = `tabs-${Math.random().toString(36).slice(2, 8)}`;
  const list = document.createElement('div');
  list.className = 'tabs-list';
  list.setAttribute('role', 'tablist');
  const buttons = [];
  const panels = [];

  [...block.children].forEach((row, idx) => {
    const [labelCell, ...cardCells] = [...row.children];
    if (!labelCell) {
      row.remove();
      return;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `${uid}-tab-${idx}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${uid}-panel-${idx}`);
    moveLabel(labelCell, button);
    list.append(button);
    buttons.push(button);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = `${uid}-panel-${idx}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    cardCells.forEach((cell) => panel.append(decorateCard(cell)));
    panels.push(panel);
    row.remove();
  });

  block.append(list, ...panels);
  buttons.forEach((button, idx) => {
    button.addEventListener('click', () => selectTab(buttons, panels, idx));
  });
  selectTab(buttons, panels, 0);
}
