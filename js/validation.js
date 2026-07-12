import { FIELD_LIMITS } from './constants.js';

export function cleanSingleLine(value = '') {
  return String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function cleanMultiline(value = '') {
  return String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function isValidEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

export function isFutureDate(value, today = new Date()) {
  if (!value) return false;
  const input = new Date(`${value}T12:00:00`);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  return Number.isNaN(input.getTime()) ? false : input > current;
}

function validateLength(errors, field, label, value, min, max) {
  const cleaned = cleanMultiline(value);
  if (!cleaned) {
    errors[field] = `Indica ${label.toLowerCase()}.`;
  } else if (cleaned.length < min) {
    errors[field] = `${label} necesita al menos ${min} caracteres.`;
  } else if (cleaned.length > max) {
    errors[field] = `${label} no puede superar ${max} caracteres.`;
  }
}

export function validateStep(step, data, today = new Date()) {
  const errors = {};

  if (step === 1 && !data.category) {
    errors.category = 'Selecciona el tipo de reclamación.';
  }

  if (step === 2) {
    validateLength(errors, 'company', 'La empresa o entidad', data.company, 2, FIELD_LIMITS.company);
    validateLength(errors, 'subject', 'El motivo', data.subject, 5, FIELD_LIMITS.subject);

    if (!data.incidentDate) {
      errors.incidentDate = 'Indica la fecha principal de la incidencia.';
    } else if (isFutureDate(data.incidentDate, today)) {
      errors.incidentDate = 'La fecha de la incidencia no puede estar en el futuro.';
    }

    const reference = cleanSingleLine(data.reference);
    if (reference.length > FIELD_LIMITS.reference) {
      errors.reference = `La referencia no puede superar ${FIELD_LIMITS.reference} caracteres.`;
    }

    if (data.amount) {
      const normalized = String(data.amount).replace(',', '.');
      const amount = Number(normalized);
      if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000) {
        errors.amount = 'Introduce un importe válido y positivo.';
      }
    }
  }

  if (step === 3) {
    validateLength(errors, 'facts', 'La explicación de los hechos', data.facts, 40, FIELD_LIMITS.facts);

    const previous = cleanMultiline(data.previousActions);
    if (previous.length > FIELD_LIMITS.previousActions) {
      errors.previousActions = `Las gestiones previas no pueden superar ${FIELD_LIMITS.previousActions} caracteres.`;
    }

    const evidence = cleanMultiline(data.evidence);
    if (evidence.length > FIELD_LIMITS.evidence) {
      errors.evidence = `Las pruebas no pueden superar ${FIELD_LIMITS.evidence} caracteres.`;
    }
  }

  if (step === 4) {
    validateLength(errors, 'request', 'La solución solicitada', data.request, 15, FIELD_LIMITS.request);
    validateLength(errors, 'fullName', 'Tu nombre', data.fullName, 2, FIELD_LIMITS.fullName);

    const email = cleanSingleLine(data.email);
    if (email.length > FIELD_LIMITS.email || !isValidEmail(email)) {
      errors.email = 'Introduce un correo válido o déjalo vacío.';
    }

    const location = cleanSingleLine(data.location);
    if (location.length > FIELD_LIMITS.location) {
      errors.location = `La localidad no puede superar ${FIELD_LIMITS.location} caracteres.`;
    }

    if (!data.documentDate) {
      errors.documentDate = 'Indica la fecha del documento.';
    }

    if (data.responseDays) {
      const days = Number(data.responseDays);
      if (!Number.isInteger(days) || days < 1 || days > 365) {
        errors.responseDays = 'El plazo debe ser un número entre 1 y 365 días.';
      }
    }
  }

  return errors;
}

export function validateAll(data, today = new Date()) {
  return [1, 2, 3, 4].reduce(
    (all, step) => ({ ...all, ...validateStep(step, data, today) }),
    {}
  );
}
