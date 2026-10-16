/**
 * subheadline-copy-tag — subheadline-copy.mjs output (header CE: heading + h*.u-text-subheadline
 * + lead copy in the SAME CE, en-company "History") additionally tagged with the section Style
 * `subheadline-copy`: the copy follows the subheadline at the header margin (1.8286rem), not
 * the header-row + content-row gap that teaser.css gives `.subheadline h2 + h3 + p` (+80 px at
 * 360). Delegates unchanged. ADD-only wrapper (cluster-hub C-final).
 */
import * as subheadlineCopy from './subheadline-copy.mjs';

export const match = subheadlineCopy.match;
export const priority = 9;

export function encode(el, ctx) {
  const r = subheadlineCopy.encode(el, ctx);
  if (!r) return r;
  const out = typeof r === 'string' ? { html: r } : r;
  const style = out.sectionStyle ? `${out.sectionStyle}, subheadline-copy` : 'subheadline-copy';
  return { ...out, sectionStyle: style };
}
