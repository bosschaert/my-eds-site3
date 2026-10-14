/**
 * map — the project map: the source's inline SVG town artwork (fixed asset
 * blocks/map/map-bg.svg, fetched and inlined so its text uses the page fonts) under 12 linked
 * pins (photo disc, numbered marker, label that slides out on hover — CSS, as on the source).
 *
 * Schema: stardust/eds-schema/index.json → sections[4]
 *   (12 ctas → /town-transformation/#projectN).
 * Decode tier: template-slotted — the pin geometry/labels are artwork; each authored row fills
 * one pin's link and photo, matched by the `#projectN` fragment of its href (else row order).
 *
 * Authoring (one row per pin): <picture> (pin photo) | <p><a href=".../#projectN">Label</a></p>
 *
 * @ew-exempt all — map: pin labels are SVG artwork text; authored rows feed each pin's href,
 *   photo and accessible name (EW5 category c)
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEWBOX = '0 0 1142.36 840.64';

// pin layer of the source artwork (labels, markers, photo clips); hrefs/photos are slotted
const PINS = [
  '<defs><clipPath id="labelpath-12"><rect x="222.64" y="558.5" width="294.99" height="82.6',
  '9" transform="translate(740.28 1199.7) rotate(180)" style="fill:none"></rect></clipPath>',
  '<clipPath id="labelpath-11"><rect x="725.21" y="32.55" width="294.99" height="82.69" sty',
  'le="fill:none"></rect></clipPath><clipPath id="labelpath-10"><rect x="110.01" y="185.05"',
  ' width="294.99" height="82.69" transform="translate(515.01 452.79) rotate(180)" style="f',
  'ill:none"></rect></clipPath><clipPath id="labelpath-9"><rect x="340.59" y="75.15" width=',
  '"294.99" height="82.69" transform="translate(976.16 233) rotate(180)" style="fill:none">',
  '</rect></clipPath><clipPath id="labelpath-8"><rect x="747.99" y="142.53" width="294.99" ',
  'height="82.69" style="fill:none"></rect></clipPath><clipPath id="labelpath-7"><rect x="4',
  '.29" y="101.37" width="294.99" height="82.69" transform="translate(303.57 285.43) rotate',
  '(180)" style="fill:none"></rect></clipPath><clipPath id="labelpath-6"><rect x="867.26" y',
  '="470.7" width="294.99" height="82.69" style="fill:none"></rect></clipPath><clipPath id=',
  '"labelpath-5"><rect x="812.46" y="379.77" width="294.99" height="82.69" style="fill:none',
  '"></rect></clipPath><clipPath id="labelpath-4"><rect x="232.38" y="276.53" width="294.99',
  '" height="82.69" transform="translate(759.74 635.75) rotate(180)" style="fill:none"></re',
  'ct></clipPath><clipPath id="labelpath-3"><rect x="885.88" y="303.24" width="294.99" heig',
  'ht="82.69" style="fill:none"></rect></clipPath><clipPath id="labelpath-2"><rect x="175.1',
  '6" y="354.23" width="294.99" height="82.69" transform="translate(645.3 791.14) rotate(18',
  '0)" style="fill:none"></rect></clipPath><clipPath id="labelpath-1"><rect x="818.17" y="2',
  '23.05" width="294.99" height="82.69" style="fill:none"></rect></clipPath><clipPath id="c',
  'lip-path-12"><circle cx="815.81" cy="265.15" r="42.52" style="fill:none;stroke:#fff;stro',
  'ke-miterlimit:10;stroke-width:2px"></circle></clipPath><clipPath id="clip-path"><circle ',
  'cx="512.95" cy="600.58" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stro',
  'ke-width:2px"></circle></clipPath><clipPath id="clip-path-2"><circle cx="725.21" cy="73.',
  '89" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></circ',
  'le></clipPath><clipPath id="clip-path-3"><circle cx="406.84" cy="226.39" r="42.52" style',
  '="fill:none;stroke:#f1f2f2;stroke-miterlimit:10;stroke-width:2px"></circle></clipPath><c',
  'lipPath id="clip-path-4"><circle cx="634.01" cy="129.91" r="42.52" style="fill:none;stro',
  'ke:#fff;stroke-miterlimit:10;stroke-width:2px"></circle></clipPath><clipPath id="clip-pa',
  'th-5"><circle cx="746.79" cy="183.87" r="42.52" style="fill:none;stroke:#fff;stroke-mite',
  'rlimit:10;stroke-width:2px"></circle></clipPath><clipPath id="clip-path-6"><circle cx="2',
  '98.76" cy="142.71" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-wi',
  'dth:2px"></circle></clipPath><clipPath id="clip-path-7"><circle cx="867.81" cy="512.6" r',
  '="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></circle></',
  'clipPath><clipPath id="clip-path-8"><circle cx="811.17" cy="421.73" r="42.52" style="fil',
  'l:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></circle></clipPath><clipPath ',
  'id="clip-path-9"><circle cx="526.67" cy="317.62" r="42.52" style="fill:#fff;stroke:#fff;',
  'stroke-miterlimit:10;stroke-width:2px"></circle></clipPath><clipPath id="clip-path-10"><',
  'circle cx="885.88" cy="344.58" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:',
  '10;stroke-width:2px"></circle></clipPath><clipPath id="clip-path-11"><circle cx="470.64"',
  ' cy="396.26" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2p',
  'x"></circle></clipPath></defs><g style="isolation:isolate"><g id="pins"><g id="pin-12"><',
  'line x1="537.59" y1="519.04" x2="518.63" y2="588.86" style="fill:none;stroke:#fff;stroke',
  '-miterlimit:10"></line><circle cx="541.65" cy="511.85" r="9.92" style="fill:#f8eb30;stro',
  'ke:#fff;stroke-miterlimit:10"></circle><path d="M537,510.06l-1.53.35-.47-1.94,2.64-.75h1',
  '.82v9.1H537Z" style="fill:#0a9dd9"></path><path d="M540.77,514.94l3.39-2.58c.84-.66,1.16',
  '-1.09,1.16-1.63a.9.9,0,0,0-1-.92c-.61,0-1.08.35-1.79,1.17l-1.69-1.41a4.17,4.17,0,0,1,3.6',
  '7-1.94c2,0,3.34,1.18,3.34,2.88v0c0,1.44-.75,2.19-2.1,3.16l-1.55,1.08h3.74v2h-7.16Z" styl',
  'e="fill:#0a9dd9"></path><a data-pin="12" class="map-pin pin-12"><g style="clip-path:url(',
  '#labelpath-12)"><g id="label-12"><rect x="262.21" y="585.71" width="253.05" height="35.7',
  '5" rx="6.04" transform="translate(777.48 1207.18) rotate(180)" style="fill:#ffe727"></re',
  'ct><text transform="translate(359.32 599.85)">HARRY REYNOLDS<tspan style="letter-spacing',
  ':-0.009066167246898842em"><tspan x="-83.25" y="12.67">PEDESTRIAN AND CYCLE SCHEME</tspan',
  '></tspan></text></g></g><g style="clip-path:url(#clip-path)"><image width="200" height="',
  '200" transform="translate(470.07 557.7) scale(0.43)"></image></g><circle cx="512.95" cy=',
  '"600.58" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"><',
  '/circle></a></g><g id="pin-11"><line x1="572.73" y1="73.89" x2="719.71" y2="73.89" style',
  '="fill:none;stroke:#fff;stroke-miterlimit:10"></line><circle cx="568.6" cy="73.89" r="9.',
  '92" style="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10"></circle><path d="M565.26,72.1',
  'l-1.52.35-.48-1.94,2.64-.75h1.82v9.1h-2.46Z" style="fill:#0a9dd9"></path><path d="M570.7',
  ',72.1l-1.52.35-.48-1.94,2.65-.75h1.82v9.1H570.7Z" style="fill:#0a9dd9"></path><a data-pi',
  'n="11" class="map-pin pin-11"><g style="clip-path:url(#labelpath-11)"><g id="label-11"><',
  'rect x="727.57" y="52.27" width="145.13" height="35.75" rx="6.04" style="fill:#ffe727"><',
  '/rect><text transform="translate(776 67.65)">FINGAL<tspan x="0" y="12.67">COASTAL WAY</t',
  'span></text></g></g><g style="clip-path:url(#clip-path-2)"><image width="200" height="20',
  '0" transform="translate(682.69 31.37) scale(0.43)"></image></g><circle cx="725.21" cy="7',
  '3.89" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></ci',
  'rcle></a></g><g id="pin-10"><line x1="519.05" y1="226.39" x2="435.45" y2="226.39" style=',
  '"fill:none;stroke:#fff;stroke-miterlimit:10"></line><circle cx="521.11" cy="226.39" r="9',
  '.92" style="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10"></circle><path d="M515.78,223',
  '.73l-1.53.35-.47-1.94,2.64-.75h1.82v9.1h-2.46Z" style="fill:#0a9dd9"></path><path d="M51',
  '9.65,226v0c0-2.56,1.63-4.7,4.19-4.7S528,223.39,528,226v0c0,2.55-1.61,4.7-4.19,4.7S519.65',
  ',228.56,519.65,226Zm5.85,0v0c0-1.44-.69-2.48-1.68-2.48s-1.65,1-1.65,2.45v0c0,1.44.67,2.4',
  '8,1.67,2.48S525.5,227.44,525.5,226Z" style="fill:#0a9dd9"></path><a data-pin="10" class=',
  '"map-pin pin-10"><g style="clip-path:url(#labelpath-10)"><g id="label-10"><rect x="283.5',
  '9" y="212.26" width="119.05" height="35.75" rx="6.04" transform="translate(686.22 460.27',
  ') rotate(180)" style="fill:#ffe727"></rect><text transform="translate(297.33 226.39)">BR',
  'EMORE<tspan x="11.74" y="12.67">CASTLE</tspan></text></g></g><g style="clip-path:url(#cl',
  'ip-path-3)"><image width="200" height="200" transform="translate(364.32 183.87) scale(0.',
  '43)"></image></g><circle cx="406.84" cy="226.39" r="42.52" style="fill:none;stroke:#f1f2',
  'f2;stroke-miterlimit:10;stroke-width:2px"></circle></a></g><g id="pin-9"><line x1="634.0',
  '1" y1="172.81" x2="634.01" y2="349.6" style="fill:none;stroke:#fff;stroke-miterlimit:10"',
  '></line><circle cx="634.01" cy="359.52" r="9.92" style="fill:#f8eb30;stroke:#fff;stroke-',
  'miterlimit:10"></circle><path d="M630.42,363.61l1.18-1.73a2.93,2.93,0,0,0,1.93.72c1,0,1.',
  '59-.72,1.71-1.88a2.75,2.75,0,0,1-1.91.73,2.79,2.79,0,0,1-3-2.85v0a3.3,3.3,0,0,1,3.6-3.29',
  ',3.57,3.57,0,0,1,2.78,1.06,4.45,4.45,0,0,1,1.08,3.34v0c0,3-1.47,5-4.18,5A4.92,4.92,0,0,1',
  ',630.42,363.61Zm4.85-5.13v0a1.2,1.2,0,0,0-1.29-1.23,1.17,1.17,0,0,0-1.26,1.21v0a1.18,1.1',
  '8,0,0,0,1.29,1.19A1.16,1.16,0,0,0,635.27,358.48Z" style="fill:#0a9dd9"></path><a data-pi',
  'n="9" class="map-pin pin-9"><g style="clip-path:url(#labelpath-9)"><g id="label-9"><rect',
  ' x="464.01" y="102.36" width="169.2" height="35.75" rx="6.04" transform="translate(1097.',
  '22 240.48) rotate(180)" style="fill:#ffe727"></rect><text transform="translate(481.64 11',
  '6.5)">RAILWAY STREET,<tspan x="1.14" y="12.67">STATION &amp; PLAZA</tspan></text></g></g',
  '><g style="clip-path:url(#clip-path-4)"><image width="200" height="200" transform="trans',
  'late(591.49 87.39) scale(0.43)"></image></g><circle cx="634.01" cy="129.91" r="42.52" st',
  'yle="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></circle></a></g><g id',
  '="pin-8"><polyline points="741.12 184.06 648.59 184.06 648.59 202.23" style="fill:none;s',
  'troke:#fff;stroke-miterlimit:10"></polyline><circle cx="648.59" cy="212.15" r="9.92" sty',
  'le="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10"></circle><path d="M644.88,214.63v0a2.',
  '21,2.21,0,0,1,1.55-2.16,2.16,2.16,0,0,1-1.24-2v0c0-1.45,1.38-2.52,3.4-2.52S652,209,652,2',
  '10.45v0a2.16,2.16,0,0,1-1.24,2,2.24,2.24,0,0,1,1.55,2.15v0c0,1.61-1.55,2.66-3.72,2.66S64',
  '4.88,216.2,644.88,214.63Zm5-.25v0c0-.58-.54-1-1.31-1s-1.3.4-1.3,1v0c0,.55.47,1,1.3,1S649',
  '.9,214.93,649.9,214.38Zm-.19-3.61v0a1,1,0,0,0-1.12-1,1,1,0,0,0-1.11.94v0a1.12,1.12,0,0,0',
  ',2.23,0Z" style="fill:#0a9dd9"></path><a data-pin="8" class="map-pin pin-8"><g style="cl',
  'ip-path:url(#labelpath-8)"><g id="label-8"><rect x="750.35" y="162.25" width="215.31" he',
  'ight="35.75" rx="6.04" style="fill:#ffe727"></rect><text transform="translate(798.78 177',
  '.63)">PROMENADE &amp;<tspan style="letter-spacing:-0.0089736553362162em"><tspan x="0" y=',
  '"12.67">COASTAL IMPROVEMENTS</tspan></tspan></text></g></g><g style="clip-path:url(#clip',
  '-path-5)"><image width="200" height="200" transform="translate(703.96 141.05) scale(0.43',
  ')"></image></g><circle cx="746.79" cy="183.87" r="42.52" style="fill:none;stroke:#fff;st',
  'roke-miterlimit:10;stroke-width:2px"></circle></a></g><g id="pin-7"><polyline points="33',
  '8.7 142.71 515.15 142.71 515.15 168.88 568.47 168.88" style="fill:none;stroke:#fff;strok',
  'e-miterlimit:10"></polyline><circle cx="574.25" cy="168.88" r="9.92" style="fill:#f8eb30',
  ';stroke:#fff;stroke-miterlimit:10"></circle><path d="M575.07,166.47h-4.18v-2.11h7v1.89l-',
  '4,7.15h-2.76Z" style="fill:#0a9dd9"></path><a data-pin="7" class="map-pin pin-7"><g styl',
  'e="clip-path:url(#labelpath-7)"><g id="label-7"><rect x="136.66" y="128.58" width="160.2',
  '5" height="35.75" rx="6.04" transform="translate(433.58 292.91) rotate(180)" style="fill',
  ':#ffe727"></rect><text transform="translate(191.61 142.71)">BREMORE<tspan x="-36.87" y="',
  '12.67">REGIONAL PARK</tspan></text></g></g><g style="clip-path:url(#clip-path-6)"><image',
  ' width="200" height="200" transform="translate(256.24 100.19) scale(0.43)"></image></g><',
  'circle cx="298.76" cy="142.71" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:',
  '10;stroke-width:2px"></circle></a></g><g id="pin-6"><line x1="628.44" y1="512.71" x2="86',
  '2.1" y2="512.71" style="fill:none;stroke:#fff;stroke-miterlimit:10"></line><circle cx="6',
  '20.38" cy="512.71" r="9.92" style="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10"></circ',
  'le><path d="M617.76,516.85a4.49,4.49,0,0,1-1.11-3.38v0c0-2.82,1.37-5,4.2-5a4.72,4.72,0,0',
  ',1,3,1l-1.18,1.77a2.84,2.84,0,0,0-1.79-.68c-1.06,0-1.59.78-1.71,1.92a3.06,3.06,0,0,1,2-.',
  '7,2.79,2.79,0,0,1,3,2.82v0a3.3,3.3,0,0,1-3.59,3.26A3.64,3.64,0,0,1,617.76,516.85Zm3.92-2',
  '.07v0a1.18,1.18,0,0,0-1.28-1.16,1.14,1.14,0,0,0-1.25,1.15v0a1.18,1.18,0,0,0,1.27,1.18A1.',
  '15,1.15,0,0,0,621.68,514.78Z" style="fill:#0a9dd9"></path><a data-pin="6" class="map-pin',
  ' pin-6"><g style="clip-path:url(#labelpath-6)"><g id="label-6"><rect x="869.62" y="490.4',
  '3" width="167.69" height="35.75" rx="6.04" style="fill:#ffe727"></rect><text transform="',
  'translate(918.06 505.8)">MILLPOND PARK –<tspan x="0" y="12.67">GREEN CORRIDOR</tspan></t',
  'ext></g></g><g style="clip-path:url(#clip-path-7)"><image width="200" height="200" trans',
  'form="translate(824.74 470.08) scale(0.43)"></image></g><circle cx="867.81" cy="512.6" r',
  '="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></circle></',
  'a></g><g id="pin-5"><line x1="769.59" y1="421.6" x2="666.58" y2="421.6" style="fill:none',
  ';stroke:#fff;stroke-miterlimit:10"></line><circle cx="656.66" cy="422.28" r="9.92" style',
  '="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10"></circle><path d="M652.84,425.13l1.43-1',
  '.68a3.43,3.43,0,0,0,2.19,1c.83,0,1.33-.41,1.33-1.05v0c0-.64-.54-1.05-1.33-1.05a2.7,2.7,0',
  ',0,0-1.44.46l-1.49-.83.26-4.58h6v2.06h-4.06l-.08,1.37a3.24,3.24,0,0,1,1.45-.32,2.8,2.8,0',
  ',0,1,3.09,2.86v0c0,2-1.53,3.21-3.73,3.21A5,5,0,0,1,652.84,425.13Z" style="fill:#0a9dd9">',
  '</path><a data-pin="5" class="map-pin pin-5"><g style="clip-path:url(#labelpath-5)"><g i',
  'd="label-5"><rect x="814.83" y="399.49" width="153.01" height="35.75" rx="6.04" style="f',
  'ill:#ffe727"></rect><text transform="translate(863.26 414.87)">2 – 4<tspan x="0" y="12.6',
  '7">DUBLIN STREET</tspan></text></g></g><g style="clip-path:url(#clip-path-8)"><image wid',
  'th="200" height="200" transform="translate(768.65 379.21) scale(0.43)"></image></g><circ',
  'le cx="811.17" cy="421.73" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;s',
  'troke-width:2px"></circle></a></g><g id="pin-4"><polyline points="615.48 383.36 526.67 3',
  '83.36 526.67 352.71" style="fill:none;stroke:#fff;stroke-miterlimit:10"></polyline><circ',
  'le cx="623.76" cy="384.68" r="9.92" style="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10',
  '"></circle><path d="M623.42,387.59H619l-.41-1.77,4.68-5.58h2.53v5.48H627v1.87h-1.15v1.75',
  'h-2.42Zm0-1.86v-2.6l-2.16,2.6Z" style="fill:#0a9dd9"></path><a data-pin="4" class="map-p',
  'in pin-4"><g style="clip-path:url(#labelpath-4)"><g id="label-4"><rect x="269.17" y="303',
  '.74" width="255.84" height="35.75" rx="6.04" transform="translate(794.17 643.23) rotate(',
  '180)" style="fill:#ffe727"></rect><text transform="translate(323.47 317.87)">REDEVELOP T',
  'HE HEART OF<tspan style="letter-spacing:-0.009066167246898842em"><tspan x="-35.28" y="12',
  '.67">MAIN STREET – GREEN CORRIDOR</tspan></tspan></text></g></g><g style="clip-path:url(',
  '#clip-path-9)"><image width="200" height="200" transform="translate(483.8 276.2) scale(0',
  '.43)"></image></g><circle cx="526.67" cy="317.62" r="42.52" style="fill:none;stroke:#fff',
  ';stroke-miterlimit:10;stroke-width:2px"></circle></a></g><g id="pin-3"><line x1="747.99"',
  ' y1="344.69" x2="880.17" y2="344.69" style="fill:none;stroke:#fff;stroke-miterlimit:10">',
  '</line><circle cx="739.93" cy="344.69" r="9.92" style="fill:#f8eb30;stroke:#fff;stroke-m',
  'iterlimit:10"></circle><path d="M736.17,348.26l1.57-1.57a3,3,0,0,0,2.16,1c.71,0,1.16-.36',
  ',1.16-.92v0c0-.58-.53-.93-1.47-.93h-1.06l-.36-1.3,2.08-1.88h-3.46v-2h6.53v1.79l-2.16,1.8',
  '5a2.54,2.54,0,0,1,2.34,2.54v0c0,1.83-1.47,3-3.49,3A4.89,4.89,0,0,1,736.17,348.26Z" style',
  '="fill:#0a9dd9"></path><a data-pin="3" class="map-pin pin-3"><g style="clip-path:url(#la',
  'belpath-3)"><g id="label-3"><rect x="888.24" y="322.96" width="150.9" height="35.75" rx=',
  '"6.04" style="fill:#ffe727"></rect><text transform="translate(937.67 338.34)">HARBOUR<ts',
  'pan x="0" y="12.67">IMPROVEMENTS</tspan></text></g></g><g style="clip-path:url(#clip-pat',
  'h-10)"><image width="200" height="200" transform="translate(843.36 302.06) scale(0.43)">',
  '</image></g><circle cx="885.88" cy="344.58" r="42.52" style="fill:none;stroke:#fff;strok',
  'e-miterlimit:10;stroke-width:2px"></circle></a></g><g id="pin-2"><line x1="656.25" y1="3',
  '96.86" x2="508" y2="396.86" style="fill:none;stroke:#fff;stroke-miterlimit:10"></line><c',
  'ircle cx="661.11" cy="397.07" r="9.92" style="fill:#f8eb30;stroke:#fff;stroke-miterlimit',
  ':10"></circle><path d="M657.64,399.59,661,397c.84-.66,1.16-1.09,1.16-1.63a.9.9,0,0,0-1-.',
  '91c-.6,0-1.08.34-1.79,1.16l-1.69-1.41a4.19,4.19,0,0,1,3.68-1.94c2,0,3.33,1.18,3.33,2.88v',
  '0c0,1.44-.75,2.19-2.09,3.16l-1.55,1.09h3.73v2h-7.15Z" style="fill:#0a9dd9"></path><a dat',
  'a-pin="2" class="map-pin pin-2"><g style="clip-path:url(#labelpath-2)"><g id="label-2"><',
  'rect x="240.2" y="381.44" width="227.58" height="35.75" rx="6.04" transform="translate(7',
  '07.98 798.63) rotate(180)" style="fill:#ffe727"></rect><text transform="translate(264.05',
  ' 395.57)">TRANSFORM QUAY STREET,<tspan x="6.25" y="12.67">HARBOUR &amp; ITS ENVIRONS</ts',
  'pan></text></g></g><g style="clip-path:url(#clip-path-11)"><image width="200" height="20',
  '0" transform="translate(428.12 353.74) scale(0.43)"></image></g><circle cx="470.64" cy="',
  '396.26" r="42.52" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"></',
  'circle></a></g><g id="pin-1"><polyline points="702.18 343.07 702.18 264.64 809.54 264.64',
  '" style="fill:none;stroke:#fff;stroke-miterlimit:10"></polyline><circle cx="702.18" cy="',
  '339.34" r="9.92" style="fill:#f8eb30;stroke:#fff;stroke-miterlimit:10"></circle><path d=',
  '"M701.6,337.27l-1.52.35-.48-1.94,2.65-.75h1.82V344H701.6Z" style="fill:#0a9dd9"></path><',
  'a data-pin="1" class="map-pin pin-1"><g style="clip-path:url(#labelpath-1)"><g id="label',
  '-1"><rect x="820.53" y="242.77" width="200.34" height="35.75" rx="6.04" style="fill:#ffe',
  '727"></rect><text transform="translate(868.96 258.15)">RNLI BOATHOUSE<tspan x="0" y="12.',
  '67">AND RAILWAY VIADUCT</tspan></text></g></g><g style="clip-path:url(#clip-path-12)"><i',
  'mage width="200" height="200" transform="translate(772.78 222.04) scale(0.43)"></image><',
  '/g><circle cx="815.81" cy="265.15" r="42.52" style="fill:none;stroke:#fff;stroke-miterli',
  'mit:10;stroke-width:2px"></circle></a></g></g></g>',
].join('');

function collectRows(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
    const link = row.querySelector('a[href]');
    const img = row.querySelector('img');
    return { link, img };
  }).filter((r) => r.link || r.img);
}

async function loadArtwork(svg) {
  try {
    const base = (window.hlx && window.hlx.codeBasePath) || '';
    const resp = await fetch(`${base}/blocks/map/map-bg.svg`);
    if (!resp.ok) return;
    const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
    const art = doc.documentElement;
    const defs = svg.querySelector('defs');
    const layer = svg.querySelector('g');
    const bgDefs = art.querySelector('defs');
    if (bgDefs) defs.prepend(...[...bgDefs.childNodes].map((n) => document.importNode(n, true)));
    const background = art.querySelector('#background');
    if (background) layer.prepend(document.importNode(background, true));
  } catch (e) {
    // artwork is decorative: the pins stay usable without it
  }
}

export default function decorate(block) {
  const rows = collectRows(block);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', VIEWBOX);
  svg.innerHTML = PINS;

  const pins = [...svg.querySelectorAll('a.map-pin')];
  rows.forEach((row, i) => {
    const href = row.link ? row.link.getAttribute('href') : '';
    const match = href.match(/#project(\d+)/);
    const num = match ? match[1] : String(i + 1);
    const pin = pins.find((p) => p.dataset.pin === num);
    if (!pin) return;
    if (href) pin.setAttribute('href', href);
    if (row.link) pin.setAttribute('aria-label', row.link.textContent.trim());
    const image = pin.querySelector('image');
    if (row.img && image) image.setAttribute('href', row.img.currentSrc || row.img.src);
  });

  block.replaceChildren(svg);
  // not awaited: the artwork is below the fold and the svg already reserves its aspect ratio
  loadArtwork(svg);
}
