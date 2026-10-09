/**
 * selfcert-modal — the source's HCP self-certification gate
 * (.cmp-experiencefragment--self-certification, dynamic-features row 10) on the PATTRNS
 * template. The CAPTURED state of every PATTRNS page is the fragment AFTER dismissal: an
 * empty, 0px wrapper — and that is the state this block delivers: nothing visible, the gate
 * persisted the way the source persists it (a cookie the "yes" affordance sets).
 * Template-slotted (#95), static tier. The live modal copy was never captured (the crawl
 * dismissed the modal before the DOM snapshot), so no copy ships with this unit.
 *
 * Authoring — rows classified by content, never by index (#42):
 *   - `Mode | dismissed` (the default when absent) delivers the dismissed state;
 *     `Mode | gate` shows the modal to visitors without the cookie — meaningful only once the
 *     copy rows below are authored. @ew-exempt text-as-metadata: the Mode key and value are
 *     config, never displayed.
 *   - optional copy rows: a heading, paragraphs, the "yes" CTA as <p><strong><a>…</a></strong></p>
 *     (sets the cookie, closes the modal) and the "no" CTA as <p><em><a href>…</a></em></p>
 *     (a plain link away from the page). Every copy node MOVES into the modal box (EW1).
 * @param {Element} block the block element
 */
const COOKIE = 'az-hcp-selfcert';

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isCta(node) {
  return node.tagName === 'P' && !!node.querySelector('a.button, strong > a, em > a')
    && node.textContent.trim() === (node.querySelector('a') || node).textContent.trim();
}

export default async function decorate(block) {
  let mode = 'dismissed';
  const copy = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2 && /^mode$/i.test(cells[0].textContent.trim())) {
      mode = cells[1].textContent.trim().toLowerCase() || mode;
      return;
    }
    cells.forEach((cell) => copy.push(...cell.children));
  });

  const overlay = slot('selfcert-overlay');
  const box = slot('selfcert-box');
  const body = slot('selfcert-body');
  const actions = slot('selfcert-actions');
  copy.forEach((node) => (isCta(node) ? actions : body).append(node));
  if (body.firstElementChild) box.append(body);
  if (actions.firstElementChild) box.append(actions);
  overlay.append(box);
  block.replaceChildren(overlay);

  let certified = false;
  try {
    certified = document.cookie.split(';').some((c) => c.trim().startsWith(`${COOKIE}=`));
  } catch {
    // cookie access denied (sandboxed harness document): behave as not yet certified
  }
  const open = mode === 'gate' && !certified && copy.length > 0;
  block.classList.toggle('selfcert-open', open);
  if (!open) return;
  actions.querySelectorAll('a.button:not(.secondary)').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.cookie = `${COOKIE}=1; path=/; max-age=31536000; SameSite=Lax`;
      block.classList.remove('selfcert-open');
    });
  });
}
