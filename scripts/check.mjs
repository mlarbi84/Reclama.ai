import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const jsFiles = [
  'js/constants.js',
  'js/validation.js',
  'js/claim.js',
  'js/pdf.js',
  'js/app.js',
  'scripts/check.mjs',
  'scripts/build.mjs'
];

for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

const requiredFiles = [
  'index.html', 'styles.css', 'vercel.json', 'manifest.webmanifest', 'icon.svg',
  'privacidad.html', 'aviso-legal.html', '404.html', ...jsFiles
];
for (const file of requiredFiles) {
  if (!existsSync(resolve(file))) throw new Error(`Falta el archivo obligatorio: ${file}`);
}

const html = readFileSync('index.html', 'utf8');
for (const reference of ['/styles.css', '/js/app.js', '/privacidad', '/aviso-legal']) {
  if (!html.includes(reference)) throw new Error(`index.html no contiene la referencia ${reference}`);
}

if (/TODO|PENDIENTE_DE_COMPLETAR/.test(html)) {
  throw new Error('La interfaz pública contiene marcadores pendientes.');
}

console.log('Comprobaciones estáticas superadas.');
