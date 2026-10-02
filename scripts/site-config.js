/*
 * Site configuration read by the consent-gated (delayed) phase.
 * Analytics ships DISABLED: the source page runs Google Analytics 4 (G-00QDEH6N5W); whether that
 * property runs on the new host is an owner decision (stardust/dynamic-features.md, row 3).
 * Flip `enabled` to true once confirmed; the tag then loads only after consent
 * (scripts/consent-check.js → consented.js).
 * Cloudflare Web Analytics (row 5) is bound to the old Cloudflare zone and is not carried.
 */
export default {
  /*
   * schema.org graph carried VERBATIM from the source page (WebSite · Person · WebPage).
   * scripts.js decorateJsonLd() emits it with every `sourceOrigin` URL repointed to the page's
   * canonical origin and primaryImageOfPage set to the page's own og:image.
   */
  schema: {
    sourceOrigin: 'https://www.niravmanubhai.com',
    graph: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://www.niravmanubhai.com/#website',
          url: 'https://www.niravmanubhai.com/',
          name: 'Nirav Manubhai — A Home on the Web',
          inLanguage: 'en',
          publisher: {
            '@id': 'https://www.niravmanubhai.com/#person',
          },
        },
        {
          '@type': 'Person',
          '@id': 'https://www.niravmanubhai.com/#person',
          name: 'Nirav Manubhai',
          url: 'https://www.niravmanubhai.com/',
          jobTitle: [
            'Writer',
            'Consultant',
            'Observer',
          ],
          sameAs: [
            'https://www.linkedin.com/in/niravmanubhai/',
          ],
        },
        {
          '@type': 'WebPage',
          '@id': 'https://www.niravmanubhai.com/#webpage',
          url: 'https://www.niravmanubhai.com/',
          name: 'Nirav Manubhai — Writer, Observer & A Home on the Web',
          description: 'Enter Nirav Manubhai’s home on the web: literary rooms, chamber mysteries, still-image stories, essays and books shaped by observation, slowness and human attention.',
          isPartOf: {
            '@id': 'https://www.niravmanubhai.com/#website',
          },
          about: {
            '@id': 'https://www.niravmanubhai.com/#person',
          },
          inLanguage: 'en',
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: 'https://www.niravmanubhai.com/assets/courtyard-cebb67.jpg',
          },
        },
      ],
    },
  },
  analytics: {
    googleTagId: 'G-00QDEH6N5W',
    enabled: false,
  },
};
