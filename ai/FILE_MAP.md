# FILE_MAP — Reclama.ai

```text
.
├── index.html
├── privacidad.html
├── aviso-legal.html
├── 404.html
├── styles.css
├── js/
│   ├── app.js
│   ├── constants.js
│   ├── validation.js
│   ├── claim.js
│   └── pdf.js
├── tests/
├── scripts/
├── docs/
├── ai/
├── .github/workflows/ci.yml
├── vercel.json
└── package.json
```

## Entry points

- Interfaz: `index.html`
- Estado e interacción: `js/app.js`
- Documento: `js/claim.js`
- PDF: `js/pdf.js`
- Validación: `js/validation.js`
- Build: `scripts/build.mjs`
- Producción: `vercel.json`

## Validar

```bash
npm run ci
```
