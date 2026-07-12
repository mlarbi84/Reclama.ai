import { cp, mkdir, rm } from 'node:fs/promises';

const files = [
  'index.html', 'privacidad.html', 'aviso-legal.html', '404.html', 'styles.css',
  'robots.txt', 'manifest.webmanifest', 'icon.svg', 'js'
];

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of files) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Build estático generado en dist/.');
