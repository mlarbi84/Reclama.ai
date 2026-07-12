import test from 'node:test';
import assert from 'node:assert/strict';
import { extractAmount, extractClaimFromNarrative, extractCompany, extractDate, getFollowUpQuestions, inferCategory } from '../js/extractor.js';

test('detecta categoría, empresa, importe, fecha y petición en un relato natural', () => {
  const data = extractClaimFromNarrative('Pedí la baja de internet a Movistar hace dos semanas. Ayer me cobraron 49,90 €. Ya he llamado dos veces y quiero que me devuelvan el dinero y confirmen la baja.', new Date('2026-07-12T12:00:00'));
  assert.equal(data.category, 'telecom');
  assert.equal(data.company, 'Movistar');
  assert.equal(data.amount, '49,90');
  assert.equal(data.incidentDate, '2026-07-11');
  assert.match(data.request, /quiero que me devuelvan/i);
});

test('extrae formatos frecuentes sin exigir lenguaje formal', () => {
  assert.equal(inferCategory('Mi vuelo de Vueling fue cancelado'), 'travel');
  assert.equal(extractCompany('Amazon me entregó un producto roto'), 'Amazon');
  assert.equal(extractAmount('Me cobraron 1.250,50 euros'), '1.250,50');
  assert.equal(extractDate('Ocurrió el 3 de julio de 2026', new Date('2026-07-12T12:00:00')), '2026-07-03');
});

test('hace como máximo tres preguntas y solo sobre datos ausentes', () => {
  const questions = getFollowUpQuestions({ company: '', incidentDate: '', request: '' });
  assert.equal(questions.length, 3);
  assert.deepEqual(questions.map((question) => question.field), ['company', 'incidentDate', 'request']);
  assert.deepEqual(getFollowUpQuestions({ company: 'Ejemplo', incidentDate: '2026-07-01', request: 'Devolución' }), []);
});
