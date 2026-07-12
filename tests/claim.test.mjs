import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClaim, buildClaimFileName, formatAmount } from '../js/claim.js';

test('genera un documento con hechos, solicitud y aviso', () => {
  const text = buildClaim({
    category: 'telecom', company: 'Operadora Ejemplo', subject: 'Cobro tras la baja', incidentDate: '2026-06-01',
    reference: 'INC-123', amount: '49,90',
    facts: 'Solicité la baja del servicio y, pese a recibir confirmación, se emitió una nueva factura',
    previousActions: 'Llamé al servicio de atención y abrí una incidencia',
    evidence: 'Factura y correo de confirmación de baja',
    request: 'Solicito la devolución del cargo y la confirmación escrita de la baja definitiva',
    responseDays: '14', fullName: 'Persona Ejemplo', email: 'persona@example.com', location: 'Barcelona', documentDate: '2026-07-12'
  });
  assert.match(text, /A la atención de Operadora Ejemplo/);
  assert.match(text, /49,90\s€/);
  assert.match(text, /SOLICITUD/);
  assert.match(text, /ayuda orientativa/);
  assert.doesNotMatch(text, /garantiza/i);
});

test('formatea importes en euros', () => {
  assert.match(formatAmount('1250.5'), /1?\.?250,50\s€|1250,50\s€/);
});

test('crea un nombre de archivo seguro', () => {
  assert.equal(buildClaimFileName({ company: 'Compañía Ágil, S.A.', documentDate: '2026-07-12' }, 'pdf'), 'reclamacion-compania-agil-s-a-2026-07-12.pdf');
});
