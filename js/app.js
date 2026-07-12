import { CATEGORIES, FIELD_LIMITS, createInitialClaim } from './constants.js';
import { buildClaim, buildClaimFileName } from './claim.js';
import { createClaimPdf } from './pdf.js';
import { validateAll, validateStep } from './validation.js';

const state = { step: 1, data: createInitialClaim(), generatedText: '', reviewed: false };
const form = document.querySelector('#claim-form');
const panels = [...document.querySelectorAll('[data-step-panel]')];
const progressItems = [...document.querySelectorAll('[data-progress-step]')];
const categoryGrid = document.querySelector('#category-grid');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const errorSummary = document.querySelector('#error-summary');
const preview = document.querySelector('#claim-preview');
const reviewCheckbox = document.querySelector('#review-confirmation');
const exportButtons = [...document.querySelectorAll('[data-export]')];
const printOutput = document.querySelector('#print-output');
const toast = document.querySelector('#status-toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function renderCategories() {
  categoryGrid.innerHTML = Object.entries(CATEGORIES).map(([key, category]) => `
    <button class="category-card" type="button" data-category="${key}" aria-pressed="false">
      <span class="category-symbol" aria-hidden="true">${category.symbol}</span>
      <span><strong>${category.label}</strong><small>${category.description}</small></span>
    </button>`).join('');

  categoryGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.data.category = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach((item) => {
      const selected = item.dataset.category === state.data.category;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    clearFieldError('category');
  });
}

function syncInputsFromState() {
  Object.entries(state.data).forEach(([name, value]) => {
    const input = form.elements.namedItem(name);
    if (input && 'value' in input) input.value = value;
  });
  updateCounters();
}

function updateCounters() {
  document.querySelectorAll('[data-counter-for]').forEach((counter) => {
    const field = counter.dataset.counterFor;
    counter.textContent = `${String(state.data[field] || '').length}/${FIELD_LIMITS[field]}`;
  });
}

function setStep(step, options = {}) {
  state.step = Math.min(5, Math.max(1, step));
  panels.forEach((panel) => { panel.hidden = Number(panel.dataset.stepPanel) !== state.step; });
  progressItems.forEach((item) => {
    const itemStep = Number(item.dataset.progressStep);
    item.classList.toggle('is-active', itemStep === state.step);
    item.classList.toggle('is-done', itemStep < state.step);
    item.querySelector('.progress-number').textContent = itemStep < state.step ? '✓' : String(itemStep);
  });

  previousButton.hidden = state.step === 1 || state.step === 5;
  nextButton.hidden = state.step === 5;
  nextButton.textContent = state.step === 4 ? 'Generar reclamación' : 'Continuar';
  clearErrors();

  if (state.step === 5) {
    preview.value = state.generatedText;
    printOutput.textContent = state.generatedText;
  }

  if (options.focus !== false) {
    const title = document.querySelector(`[data-step-panel="${state.step}"] .step-title`);
    title?.setAttribute('tabindex', '-1');
    title?.focus({ preventScroll: false });
  }
}

function clearErrors() {
  errorSummary.hidden = true;
  errorSummary.innerHTML = '';
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
  form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
}

function clearFieldError(fieldName) {
  form.elements.namedItem(fieldName)?.removeAttribute?.('aria-invalid');
  const error = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (error) error.textContent = '';
}

function showErrors(errors) {
  clearErrors();
  const entries = Object.entries(errors);
  if (!entries.length) return;
  errorSummary.hidden = false;
  errorSummary.innerHTML = `<strong>Revisa estos datos:</strong><ul>${entries.map(([, message]) => `<li>${message}</li>`).join('')}</ul>`;
  entries.forEach(([fieldName, message]) => {
    form.elements.namedItem(fieldName)?.setAttribute?.('aria-invalid', 'true');
    const error = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (error) error.textContent = message;
  });
  errorSummary.focus();
}

function readFormData() {
  const data = new FormData(form);
  Object.keys(state.data).forEach((key) => {
    if (key !== 'category') state.data[key] = String(data.get(key) || '');
  });
}

form.addEventListener('input', (event) => {
  const field = event.target;
  if (!field.name || !(field.name in state.data)) return;
  state.data[field.name] = field.value;
  clearFieldError(field.name);
  updateCounters();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  readFormData();
  const errors = validateStep(state.step, state.data);
  if (Object.keys(errors).length) return showErrors(errors);
  if (state.step < 4) return setStep(state.step + 1);

  const allErrors = validateAll(state.data);
  if (Object.keys(allErrors).length) {
    const firstField = Object.keys(allErrors)[0];
    const targetStep = firstField === 'category' ? 1
      : ['company', 'subject', 'incidentDate', 'reference', 'amount'].includes(firstField) ? 2
      : ['facts', 'previousActions', 'evidence'].includes(firstField) ? 3 : 4;
    setStep(targetStep, { focus: false });
    return showErrors(allErrors);
  }

  state.generatedText = buildClaim(state.data);
  state.reviewed = false;
  reviewCheckbox.checked = false;
  updateExportState();
  setStep(5);
});

previousButton.addEventListener('click', () => setStep(state.step - 1));
preview.addEventListener('input', () => {
  state.generatedText = preview.value;
  printOutput.textContent = state.generatedText;
});
reviewCheckbox.addEventListener('change', () => {
  state.reviewed = reviewCheckbox.checked;
  updateExportState();
});

function updateExportState() {
  exportButtons.forEach((button) => { button.disabled = !state.reviewed; });
}

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

async function copyClaim() {
  try { await navigator.clipboard.writeText(state.generatedText); }
  catch { preview.select(); document.execCommand('copy'); }
  showToast('Reclamación copiada al portapapeles.');
}

document.querySelector('#copy-button').addEventListener('click', copyClaim);
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
document.querySelector('#reset-button').addEventListener('click', () => {
  if (!window.confirm('Se borrarán del navegador todos los datos introducidos. ¿Quieres empezar de nuevo?')) return;
  state.data = createInitialClaim();
  state.generatedText = '';
  state.reviewed = false;
  form.reset();
  syncInputsFromState();
  document.querySelectorAll('[data-category]').forEach((item) => {
    item.classList.remove('is-selected');
    item.setAttribute('aria-pressed', 'false');
  });
  setStep(1);
  showToast('Datos eliminados. Puedes empezar otra reclamación.');
});

document.querySelectorAll('[data-scroll-to-app]').forEach((link) => {
  link.addEventListener('click', () => window.setTimeout(() => document.querySelector('#crear')?.focus({ preventScroll: true }), 200));
});

renderCategories();
syncInputsFromState();
setStep(1, { focus: false });
updateExportState();
