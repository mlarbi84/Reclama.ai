import test from 'node:test';
import assert from 'node:assert/strict';
import { createClaimPdf, wrapText } from '../js/pdf.js';

test('ajusta líneas largas', () => {
  const lines = wrapText('Esta es una frase suficientemente larga para comprobar que el texto se divide en varias líneas.', 25);
  assert.ok(lines.length > 1);
  assert.ok(lines.every((line) => line.length <= 25));
});

test('genera un PDF válido y no vacío', async () => {
  const blob = createClaimPdf('Reclamación de prueba\n\nTexto con acentos: devolución, compañía y 49,90 €.');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const prefix = String.fromCharCode(...bytes.slice(0, 8));
  assert.equal(blob.type, 'application/pdf');
  assert.equal(prefix, '%PDF-1.4');
  assert.ok(bytes.length > 500);
});
