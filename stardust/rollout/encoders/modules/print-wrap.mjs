/**
 * print-wrap — not a block: a `<main>` child `div.d-print-none` wrapping exactly ONE
 * `.o-container` (Vitesco spin-off "Vitesco Technologies Investor Relations", IR contact). The
 * core only reads the ground class off a main-level `.o-container`, so the wrapped container
 * lost its section Style (is-lightgray band rendered white). Walks the container and returns its
 * ground as the section Style (+ `nested-full` for a white is-nested container). Priority 200.
 * (cluster-content)
 * CORE NOTE: encode.mjs encodeSection could unwrap a single-container print wrapper.
 */
export const match = 'div.d-print-none';
export const priority = 200;

const GROUNDS = ['is-yellow', 'is-lightgray', 'is-pastel-yellow', 'is-pastel-red', 'is-pastel-blue',
  'is-pastel-green', 'has-image'];

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).parent().is('main')) return null;
  const kids = $(el).children();
  if (kids.length !== 1 || !kids.first().is('.o-container')) return null;
  const cls = (kids.first().attr('class') || '').split(/\s+/);
  const styles = GROUNDS.filter((g) => cls.includes(g));
  // a white `is-nested` container (IR contact "Services"): no side padding, its row's -16px
  // margins put the grid edge to edge (h1 at x 0) at every width → section Style nested-full
  if (cls.includes('is-nested') && cls.includes('is-white') && !cls.includes('has-image')) {
    styles.push('nested-full');
  }
  const style = styles.join(', ');
  const html = ctx.walk(kids.get(0));
  return style ? { html, sectionStyle: style } : html;
}
