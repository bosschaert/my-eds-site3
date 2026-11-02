# Font licensing

| File | Family | Foundry | Status |
|---|---|---|---|
| hydroflask-sans-regular.woff2 | HydroFlask Sans 400 | Proprietary (Hydro Flask / Helen of Troy brand face; foundry unconfirmed) | Self-hosted from www.hydroflask.com for same-design fidelity; embedding license for this origin NOT yet confirmed |
| hydroflask-sans-regular-italic.woff2 | HydroFlask Sans 400 italic | same | same |
| hydroflask-sans-medium.woff2 | HydroFlask Sans 500 | same | same |
| hydroflask-sans-bold.woff2 | HydroFlask Sans 700/800 | same | same |

Confirm the webfont embedding license before relying on this origin in production.

Remove path: delete the four `.woff2` files and the `@font-face` rules in `styles/fonts.css`.
Every stack names `hydro-flask-sans-fallback` (metric-matched Arial, `styles/styles.css`) second,
so text keeps its line metrics without the brand face.
