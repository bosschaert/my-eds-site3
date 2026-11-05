/**
 * Gallery: every authored picture becomes a grid item (two columns, one on phones).
 * Authored rows/cells may hold the images in any arrangement; pictures are moved, never rebuilt.
 * @param {Element} block The gallery block element
 */
export default function decorate(block) {
  // the source's content-root class, so one gate scope fits both sides
  block.classList.add('fields-gallery');
  const media = [...block.querySelectorAll('picture, img')]
    .filter((el) => el.tagName === 'PICTURE' || !el.closest('picture'));
  if (!media.length) return;
  block.replaceChildren(...media);
}
