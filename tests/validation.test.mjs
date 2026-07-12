import test from 'node:test';
import assert from 'node:assert/strict';
import { isFutureDate, isValidEmail, validateAll, validateStep } from '../js/validation.js';
import { createInitialClaim } from '../js/constants.js';

test('el correo opcional se valida sin bloquear valores vacíos', () => {
  assert.equal(isValidEmail(''), true);
  assert.equal(isValidEmail('persona@example.com'), true);
  assert.equal(isValidEmail('correo-invalido'), false);
});

test('detecta una fecha futura', () => {
  const today = new Date('2026-07-12T12:00:00');
  assert.equal(isFutureDate('2026-07-13', today), true);
  assert.equal(isFutureDate('2026-07-12', today), false);
});

test('el primer paso exige categoría', () => {
  const claim = createInitialClaim(new Date('2026-07-12T12:00:00'));
  assert.deepEqual(validateStep(1, claim), { category: 'Selecciona el tipo de reclamación.' });
});

test('un caso completo supera la validación', () => {
  const claim = {
    ...createInitialClaim(new Date('2026-07-12T12:00:00')),
    category: 'shopping',
    company: 'Comercio Ejemplo',
    subject: 'Producto defectuoso',
    incidentDate: '2026-07-01',
    facts: 'Compré un producto que dejó de funcionar tras el primer uso y comuniqué la incidencia el mismo día.',
    request: 'Solicito la sustitución del producto o la devolución íntegra del importe abonado.',
    fullName: 'Persona Ejemplo'
  };
  assert.deepEqual(validateAll(claim, new Date('2026-07-12T12:00:00')), {});
});
