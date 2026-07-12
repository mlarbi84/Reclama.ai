import { CATEGORIES, createInitialClaim } from './constants.js';
import { cleanMultiline, cleanSingleLine } from './validation.js';

const CATEGORY_KEYWORDS = {
  telecom: ['movistar', 'vodafone', 'orange', 'digi', 'lowi', 'o2', 'simyo', 'teléfono', 'telefonía', 'internet', 'fibra', 'router', 'línea', 'permanencia'],
  shopping: ['amazon', 'aliexpress', 'tienda', 'compra', 'pedido', 'producto', 'devolución', 'garantía', 'defectuoso', 'roto', 'reembolso'],
  travel: ['vuelo', 'aerolínea', 'vueling', 'ryanair', 'iberia', 'renfe', 'tren', 'hotel', 'reserva', 'equipaje', 'viaje', 'retraso', 'cancelación'],
  finance: ['banco', 'caixabank', 'bbva', 'santander', 'seguro', 'aseguradora', 'póliza', 'comisión', 'tarjeta', 'cuenta', 'cargo'],
  utilities: ['endesa', 'naturgy', 'iberdrola', 'luz', 'gas', 'agua', 'suministro', 'contador', 'factura eléctrica']
};

const KNOWN_COMPANIES = ['Movistar', 'Vodafone', 'Orange', 'Digi', 'Lowi', 'O2', 'Simyo', 'Amazon', 'AliExpress', 'Zara', 'Renfe', 'Vueling', 'Ryanair', 'Iberia', 'Booking', 'CaixaBank', 'BBVA', 'Santander', 'Mapfre', 'Endesa', 'Naturgy', 'Iberdrola'];
const MONTHS = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };

function toIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

function normalise(value) {
  return cleanSingleLine(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function inferCategory(text) {
  const source = normalise(text);
  let best = 'other';
  let bestScore = 0;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((total, keyword) => total + (source.includes(normalise(keyword)) ? 1 : 0), 0);
    if (score > bestScore) { best = category; bestScore = score; }
  }
  return best;
}

export function extractCompany(text) {
  const known = KNOWN_COMPANIES.find((company) => new RegExp(`\\b${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text));
  if (known) return known;
  const labelled = text.match(/(?:empresa|compañía|operadora|banco|aseguradora|tienda|aerolínea|agencia)\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ&.-]*(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ&.-]*){0,2})/u);
  if (labelled) return cleanSingleLine(labelled[1]);
  const leading = text.trim().match(/^([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ&.-]*(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ&.-]*){0,2})\s+(?:me|no|ha|me ha|cobró|cargó|canceló|vendió|facturó)/u);
  return leading ? cleanSingleLine(leading[1]) : '';
}

export function extractAmount(text) {
  const match = text.match(/(?:importe|precio|cargo|cobro|factura|total)?\s*(?:de\s*)?(\d{1,3}(?:[.\s]\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?)/i);
  return match ? match[1].replace(/\s/g, '') : '';
}

export function extractReference(text) {
  const match = text.match(/(?:pedido|contrato|expediente|incidencia|reserva|factura)\s*(?:n(?:úm(?:ero)?)?[.ºo]*|#|:)?\s*([A-Z0-9][A-Z0-9-]{3,})/i);
  return match ? cleanSingleLine(match[1]).toUpperCase() : '';
}

export function extractDate(text, today = new Date()) {
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];
  const numeric = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  if (numeric) return `${numeric[3]}-${numeric[2].padStart(2, '0')}-${numeric[1].padStart(2, '0')}`;
  const words = normalise(text).match(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)(?:\s+de\s+(20\d{2}))?/);
  if (words) return toIsoDate(new Date(Number(words[3] || today.getFullYear()), MONTHS[words[2]], Number(words[1]), 12));
  const source = normalise(text);
  const relative = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (/\banteayer\b/.test(source)) relative.setDate(relative.getDate() - 2);
  else if (/\bayer\b/.test(source)) relative.setDate(relative.getDate() - 1);
  else {
    const ago = source.match(/hace\s+(\d{1,3})\s+(dia|dias|semana|semanas)/);
    if (!ago) return '';
    relative.setDate(relative.getDate() - Number(ago[1]) * (ago[2].startsWith('semana') ? 7 : 1));
  }
  return toIsoDate(relative);
}

function splitSentences(text) {
  return cleanMultiline(text).split(/(?<=[.!?])\s+|\n+/).map((sentence) => sentence.trim()).filter(Boolean);
}

export function extractRequest(text, category = inferCategory(text)) {
  const sentences = splitSentences(text);
  const explicit = sentences.find((sentence) => /\b(?:quiero|solicito|pido|necesito|exijo|me devuelvan|que me devuelvan|que cancelen|que reparen|que sustituyan)\b/i.test(sentence));
  if (explicit) return explicit.replace(/^(?:por eso,?\s*)/i, '');
  const source = normalise(text);
  if ((source.includes('baja') || source.includes('cancel')) && (source.includes('cobro') || source.includes('factura'))) return 'Solicito la cancelación definitiva del servicio y la devolución de los importes cobrados después de solicitar la baja.';
  if (source.includes('cobro') || source.includes('cargo') || source.includes('factura incorrecta')) return 'Solicito la devolución del importe cobrado incorrectamente y la corrección de la facturación.';
  if (source.includes('defectuoso') || source.includes('roto') || source.includes('no funciona')) return 'Solicito la sustitución del producto o, si no fuera posible, la devolución íntegra del importe abonado.';
  if (category === 'travel' && (source.includes('cancel') || source.includes('retraso'))) return 'Solicito una solución por la incidencia, incluyendo el reembolso o compensación que corresponda, y una respuesta por escrito.';
  return '';
}

export function inferSubject(text, category = inferCategory(text)) {
  const source = normalise(text);
  if (source.includes('baja') && (source.includes('cobro') || source.includes('factura'))) return 'Cobro después de solicitar la baja';
  if (source.includes('defectuoso') || source.includes('roto') || source.includes('no funciona')) return 'Producto defectuoso o que no funciona';
  if (source.includes('retraso')) return 'Retraso del servicio contratado';
  if (source.includes('cancel')) return 'Cancelación del servicio o reserva';
  if (source.includes('devolucion') || source.includes('reembolso')) return 'Devolución o reembolso pendiente';
  if (source.includes('cobro') || source.includes('cargo') || source.includes('comision')) return 'Cobro, cargo o comisión no conforme';
  return `Incidencia relacionada con ${CATEGORIES[category]?.label.toLowerCase() || 'un servicio de consumo'}`;
}

function extractSentenceByKeywords(text, keywords) {
  return splitSentences(text).filter((sentence) => keywords.some((keyword) => normalise(sentence).includes(normalise(keyword)))).join(' ');
}

export function extractClaimFromNarrative(text, today = new Date()) {
  const narrative = cleanMultiline(text);
  const category = inferCategory(narrative);
  return { ...createInitialClaim(today), category, company: extractCompany(narrative), subject: inferSubject(narrative, category), incidentDate: extractDate(narrative, today), reference: extractReference(narrative), amount: extractAmount(narrative), facts: narrative, previousActions: extractSentenceByKeywords(narrative, ['llamé', 'llame', 'escribí', 'escribi', 'contacté', 'contacte', 'reclamé', 'reclame', 'correo', 'chat', 'atención al cliente']), evidence: extractSentenceByKeywords(narrative, ['factura', 'captura', 'correo', 'contrato', 'justificante', 'foto', 'vídeo', 'video', 'ticket']), request: extractRequest(narrative, category) };
}

export function getFollowUpQuestions(data) {
  return [
    !cleanSingleLine(data.company) && { field: 'company', prompt: '¿A qué empresa o entidad quieres reclamar?', type: 'text', placeholder: 'Ej. Movistar, una tienda online, tu banco…' },
    !cleanSingleLine(data.incidentDate) && { field: 'incidentDate', prompt: '¿Cuándo ocurrió aproximadamente?', type: 'date', placeholder: '' },
    !cleanMultiline(data.request) && { field: 'request', prompt: '¿Qué solución quieres que te den?', type: 'textarea', placeholder: 'Ej. que me devuelvan el cobro y confirmen la baja.' }
  ].filter(Boolean).slice(0, 3);
}

export function applyFollowUpAnswer(data, field, answer) {
  const value = field === 'request' ? cleanMultiline(answer) : cleanSingleLine(answer);
  return { ...data, [field]: value };
}
