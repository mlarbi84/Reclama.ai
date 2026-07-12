import { CATEGORIES, createInitialClaim } from './constants.js';
import { buildClaim, buildClaimFileName, formatAmount, formatSpanishDate } from './claim.js';
import { createClaimPdf } from './pdf.js';
import { isValidEmail } from './validation.js';
import { applyFollowUpAnswer, extractClaimFromNarrative, getFollowUpQuestions } from './extractor.js';

const state = {
  phase: 'story',
  data: createInitialClaim(),
  narrative: '',
  questions: [],
  questionIndex: 0,
  generatedText: '',
  reviewed: false
};

const chatLog = document.querySelector('#chat-log');
const storyForm = document.querySelector('#story-form');
const storyInput = document.querySelector('#story-input');
const storyError = document.querySelector('#story-error');
const followupForm = document.querySelector('#followup-form');
const followupField = document.querySelector('#followup-field');
const followupError = document.querySelector('#followup-error');
const skipQuestion = document.querySelector('#skip-question');
const reviewPanel = document.querySelector('#review-panel');
const preview = document.querySelector('#claim-preview');
const reviewCheckbox = document.querySelector('#review-confirmation');
const exportButtons = [...document.querySelectorAll('[data-export]')];
const progressItems = [...document.querySelectorAll('[data-progress-phase]')];
const detailFields = [...document.querySelectorAll('[data-detail-field]')];
const printOutput = document.querySelector('#print-output');
const toast = document.querySelector('#status-toast');
let toastTimer;

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function addMessage(role, content, { html = false } = {}) {
  const article = document.createElement('article');
  article.className = `chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  article.innerHTML = role === 'user'
    ? `<div class="chat-bubble">${html ? content : `<p>${escapeHtml(content)}</p>`}</div>`
    : `<div class="chat-avatar" aria-hidden="true">R</div><div class="chat-bubble">${html ? content : `<p>${escapeHtml(content)}</p>`}</div>`;
  chatLog.appendChild(article);
  article.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  return article;
}

function setPhase(phase) {
  state.phase = phase;
  const order = { story: 0, clarify: 1, review: 2 };
  progressItems.forEach((item, index) => {
    item.classList.toggle('is-active', index === order[phase]);
    item.classList.toggle('is-done', index < order[phase]);
    item.querySelector('.progress-number').textContent = index < order[phase] ? '✓' : String(index + 1);
  });
}

function summaryHtml(data) {
  const items = [
    ['Tipo', CATEGORIES[data.category]?.label || 'Otro caso'],
    ['Empresa', data.company || 'Por confirmar'],
    ['Fecha', data.incidentDate ? formatSpanishDate(data.incidentDate) : 'Por confirmar'],
    ['Importe', data.amount ? formatAmount(data.amount) : 'No indicado'],
    ['Petición', data.request || 'Por confirmar']
  ];
  return `<div class="understanding"><strong>Esto es lo que he entendido:</strong><dl>${items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl><small>Podrás corregir cualquier dato antes de descargar.</small></div>`;
}

function currentQuestion() {
  return state.questions[state.questionIndex];
}

function renderQuestion() {
  const question = currentQuestion();
  if (!question) return generateDraft();
  addMessage('assistant', `<p><strong>${escapeHtml(question.prompt)}</strong></p><p class="chat-hint">Puedes saltarla si no lo sabes.</p>`, { html: true });
  const control = question.type === 'textarea'
    ? `<textarea class="textarea followup-input" id="followup-answer" rows="3" maxlength="1500" placeholder="${escapeHtml(question.placeholder)}"></textarea>`
    : `<input class="input followup-input" id="followup-answer" type="${question.type}" maxlength="160" placeholder="${escapeHtml(question.placeholder)}">`;
  followupField.innerHTML = `<label class="sr-only" for="followup-answer">${escapeHtml(question.prompt)}</label>${control}`;
  followupError.textContent = '';
  followupForm.hidden = false;
  document.querySelector('#followup-answer')?.focus();
}

function moveToNextQuestion() {
  state.questionIndex += 1;
  if (state.questionIndex >= state.questions.length) return generateDraft();
  renderQuestion();
}

function populateDetailFields() {
  detailFields.forEach((field) => { field.value = state.data[field.name] || ''; });
}

function generateDraft() {
  followupForm.hidden = true;
  state.generatedText = buildClaim(state.data);
  preview.value = state.generatedText;
  printOutput.textContent = state.generatedText;
  populateDetailFields();
  reviewCheckbox.checked = false;
  state.reviewed = false;
  updateExportState();
  reviewPanel.hidden = false;
  setPhase('review');
  addMessage('assistant', '<p><strong>Ya tienes un primer borrador.</strong></p><p>Lo he generado sin pedirte datos personales. Revisa los campos detectados y completa únicamente lo que necesites antes de descargarlo.</p>', { html: true });
  reviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

storyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const narrative = storyInput.value.trim();
  if (narrative.length < 30) {
    storyError.textContent = 'Cuéntame un poco más para poder preparar un borrador útil (mínimo 30 caracteres).';
    storyInput.focus();
    return;
  }

  storyError.textContent = '';
  state.narrative = narrative;
  state.data = extractClaimFromNarrative(narrative);
  state.questions = getFollowUpQuestions(state.data);
  state.questionIndex = 0;
  addMessage('user', narrative);
  addMessage('assistant', summaryHtml(state.data), { html: true });
  storyForm.hidden = true;

  if (state.questions.length) {
    setPhase('clarify');
    renderQuestion();
  } else {
    generateDraft();
  }
});

followupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = currentQuestion();
  const input = document.querySelector('#followup-answer');
  const answer = input?.value.trim() || '';
  if (!answer) {
    followupError.textContent = 'Escribe una respuesta o pulsa “No lo sé / completar después”.';
    input?.focus();
    return;
  }
  followupError.textContent = '';
  state.data = applyFollowUpAnswer(state.data, question.field, answer);
  addMessage('user', question.type === 'date' ? formatSpanishDate(answer) : answer);
  followupForm.hidden = true;
  moveToNextQuestion();
});

skipQuestion.addEventListener('click', () => {
  addMessage('user', 'Prefiero completarlo después.');
  followupForm.hidden = true;
  moveToNextQuestion();
});

function updateExportState() {
  exportButtons.forEach((button) => { button.disabled = !state.reviewed; });
}

reviewCheckbox.addEventListener('change', () => {
  state.reviewed = reviewCheckbox.checked;
  updateExportState();
});

preview.addEventListener('input', () => {
  state.generatedText = preview.value;
  printOutput.textContent = state.generatedText;
});

document.querySelector('#update-draft-button').addEventListener('click', () => {
  const emailField = detailFields.find((field) => field.name === 'email');
  if (emailField?.value && !isValidEmail(emailField.value)) {
    showToast('Revisa el correo: no parece válido.');
    emailField.focus();
    return;
  }
  detailFields.forEach((field) => { state.data[field.name] = field.value.trim(); });
  state.generatedText = buildClaim(state.data);
  preview.value = state.generatedText;
  printOutput.textContent = state.generatedText;
  reviewCheckbox.checked = false;
  state.reviewed = false;
  updateExportState();
  showToast('Borrador actualizado con los datos corregidos.');
});

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.querySelector('#copy-button').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(state.generatedText); }
  catch { preview.select(); document.execCommand('copy'); }
  showToast('Reclamación copiada al portapapeles.');
});

document.querySelector('#text-button').addEventListener('click', () => {
  downloadBlob(new Blob([state.generatedText], { type: 'text/plain;charset=utf-8' }), buildClaimFileName(state.data, 'txt'));
  showToast('Archivo de texto descargado.');
});

document.querySelector('#pdf-button').addEventListener('click', () => {
  downloadBlob(createClaimPdf(state.generatedText), buildClaimFileName(state.data, 'pdf'));
  showToast('PDF generado en tu navegador.');
});

document.querySelector('#print-button').addEventListener('click', () => {
  printOutput.textContent = state.generatedText;
  window.print();
});

function resetAssistant() {
  state.phase = 'story';
  state.data = createInitialClaim();
  state.narrative = '';
  state.questions = [];
  state.questionIndex = 0;
  state.generatedText = '';
  state.reviewed = false;
  chatLog.innerHTML = '<article class="chat-message assistant-message"><div class="chat-avatar" aria-hidden="true">R</div><div class="chat-bubble"><strong>Cuéntame qué ha pasado.</strong><p>No hace falta que lo ordenes ni que uses palabras formales. Incluye lo que recuerdes: empresa, fecha, importe, qué hiciste y qué solución esperas.</p></div></article>';
  storyInput.value = '';
  storyForm.hidden = false;
  followupForm.hidden = true;
  reviewPanel.hidden = true;
  reviewCheckbox.checked = false;
  updateExportState();
  setPhase('story');
  storyInput.focus();
}

document.querySelector('#reset-button').addEventListener('click', () => {
  if (!window.confirm('Se borrarán del navegador todos los datos introducidos. ¿Quieres empezar de nuevo?')) return;
  resetAssistant();
  showToast('Datos eliminados. Puedes contar otro caso.');
});

document.querySelectorAll('[data-scroll-to-app]').forEach((link) => {
  link.addEventListener('click', () => window.setTimeout(() => storyInput.focus({ preventScroll: true }), 220));
});

setPhase('story');
updateExportState();
