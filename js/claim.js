import { CATEGORIES, DISCLAIMER } from './constants.js';
import { cleanMultiline, cleanSingleLine } from './validation.js';

export function formatSpanishDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatAmount(value) {
  if (value === '' || value == null) return '';
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(number) : cleanSingleLine(value);
}

function sentence(value) {
  const text = cleanMultiline(value);
  return !text ? '' : /[.!?]$/.test(text) ? text : `${text}.`;
}

export function buildClaim(data) {
  const category = CATEGORIES[data.category] || CATEGORIES.other;
  const company = cleanSingleLine(data.company) || '[EMPRESA O ENTIDAD]';
  const subject = cleanSingleLine(data.subject) || 'la incidencia descrita';
  const reference = cleanSingleLine(data.reference);
  const fullName = cleanSingleLine(data.fullName) || '[TU NOMBRE Y APELLIDOS]';
  const email = cleanSingleLine(data.email);
  const location = cleanSingleLine(data.location);
  const facts = cleanMultiline(data.facts) || '[DESCRIBE AQUÍ LOS HECHOS]';
  const previousActions = cleanMultiline(data.previousActions);
  const evidence = cleanMultiline(data.evidence);
  const request = cleanMultiline(data.request) || '[INDICA AQUÍ LA SOLUCIÓN QUE SOLICITAS]';
  const amount = formatAmount(data.amount);
  const documentDate = data.documentDate || new Date().toISOString().slice(0, 10);
  const dateLine = [location, formatSpanishDate(documentDate)].filter(Boolean).join(', ');
  const incidentLine = data.incidentDate
    ? `La incidencia principal tuvo lugar el ${formatSpanishDate(data.incidentDate)}. ${sentence(facts)}`
    : `La fecha exacta de la incidencia deberá completarse antes de enviar el escrito. ${sentence(facts)}`;

  return [
    dateLine,
    `A la atención de ${company}`,
    '',
    `ASUNTO: Reclamación por ${subject}`,
    reference ? `REFERENCIA: ${reference}` : '',
    '',
    `Yo, ${fullName}${email ? `, con correo de contacto ${email}` : ''}, presento la siguiente reclamación en relación con el ${category.context}:`,
    '',
    'HECHOS',
    incidentLine,
    amount ? `El importe relacionado con la incidencia es de ${amount}.` : '',
    previousActions ? `Gestiones realizadas previamente: ${sentence(previousActions)}` : '',
    evidence ? `Pruebas o documentación disponible: ${sentence(evidence)}` : '',
    '',
    'SOLICITUD',
    sentence(request),
    data.responseDays ? `Solicito una respuesta por escrito en un plazo de ${Number(data.responseDays)} días desde la recepción de esta reclamación.` : 'Solicito una respuesta por escrito a esta reclamación.',
    '',
    'Agradezco que se revise el caso y se me comunique la resolución por un medio que deje constancia.',
    '',
    'Atentamente,',
    fullName,
    '',
    '---',
    DISCLAIMER
  ].filter((block, index, array) => block !== '' || (index > 0 && array[index - 1] !== '')).join('\n');
}

export function slugify(value) {
  return cleanSingleLine(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55);
}

export function buildClaimFileName(data, extension) {
  return `reclamacion-${slugify(data.company) || 'empresa'}-${data.documentDate || new Date().toISOString().slice(0, 10)}.${extension}`;
}
