/**
 * section-background — the source o-container__bg-image layer: an image covering the whole
 * section band behind its content (o-container.has-image), optionally lucent (opacity .3).
 *
 * Content: one cell with the image (picture / img). Variants: lucent | x-left|x-center|x-right |
 * y-top|y-center|y-bottom (background-position of the source layer).
 * Decode: the authored picture is MOVED into the layer (EW1); the block wrapper becomes an
 * absolute cover layer of its section (CSS), so it may sit anywhere in the section. EW9.
 */
export default function decorate(block) {
  if (block.querySelector('.section-background-layer')) return;
  const layer = document.createElement('div');
  layer.className = 'section-background-layer';
  const media = block.querySelector('picture') || block.querySelector('img');
  if (media) layer.append(media);
  layer.querySelectorAll('img').forEach((img) => {
    img.setAttribute('alt', img.getAttribute('alt') || '');
  });
  [...block.children].forEach((row) => row.remove());
  block.append(layer);
  block.setAttribute('aria-hidden', 'true');
}
