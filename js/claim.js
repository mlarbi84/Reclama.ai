import { CATEGORIES, DISCLAIMER } from './constants.js';
import { cleanMultiline, cleanSingleLine } from './validation.js';

export function formatSpanishDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatAmount(value) {
  if (value === '' || value === null || value === undefined) return '';
  const number = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(number)) return cleanSingleLine(value);
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(number);
}

function sentence(value) {
  const text = cleanMultiline(value);
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

export function buildClaim(data) {
  const category = CATEGORIES[data.category] || CATEGORIES.other;
  const company = cleanSingleLine(data.company);
  const subject = cleanSingleLine(data.subject);
  const reference = cleanSingleLine(data.reference);
  const fullName = cleanSingleLine(data.fullName);
  const email = cleanSingleLine(data.email);
  const location = cleanSingleLine(data.location);
  const facts = cleanMultiline(data.facts);
  const previousActions = cleanMultiline(data.previousActions);
  const evidence = cleanMultiline(data.evidence);
  const request = cleanMultiline(data.request);
  const amount = formatAmount(data.amount);
  const dateLine = [location, formatSpanishDate(data.documentDate)].filter(Boolean).join(', ');

  const blocks = [
    dateLine,
    `A la atención de ${company}`,
    '',
    `ASUNTO: Reclamación por ${subject}`,
    reference ? `REFERENCIA: ${reference}` : '',
    '',
    `Yo, ${fullName}${email ? `, con correo de contacto ${email}` : ''}, presento la siguiente reclamación en relación con el ${category.context}:`,
    '',
    `HECHOS`,
    `La incidencia principal tuvo lugar el ${formatSpanishDate(data.incidentDate)}. ${sentence(facts)}`,
    amount ? `El importe relacionado con la incidencia es de ${amount}.` : '',
    previousActions ? `Gestiones realizadas previamente: ${sentence(previousActions)}` : '',
    evidence ? `Pruebas o documentación disponible: ${sentence(evidence)}` : '',
    '',
    `SOLICITUD`,
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
  ];

  return blocks.filter((block, index, array) => {
    if (block !== '') return true;
    return index > 0 && array[index - 1] !== '';
  }).join('\n');
}

export function slugify(value) {
  return cleanSingleLine(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 55);
}

export function buildClaimFileName(data, extension) {
  const company = slugify(data.company) || 'empresa';
  const date = data.documentDate || new Date().toISOString().slice(0, 10);
  return `reclamacion-${company}-${date}.${extension}`;
}
