# AGENTS — Reclama.ai

## Antes de trabajar

Lee, en este orden:

1. `ai/REPO_BRAIN.md`
2. `ai/GUARDRAILS.md`
3. `ai/TASKS.md`
4. `ai/FILE_MAP.md`
5. `ai/SESSION_STATE.md`
6. `ai/WORKLOG.md`

Después resume qué entiendes, qué modificarás y el riesgo del cambio.

## Naturaleza

Reclama.ai es una aplicación web B2C para preparar borradores de reclamaciones de consumo. El MVP es estático y procesa todo localmente.

## Guardrail principal

No presentar el producto como abogado, asesor jurídico, representante ni garantía de éxito.

## Reglas

- No introducir backend, persistencia o envío a terceros sin decisión de privacidad explícita.
- No registrar datos personales.
- No usar ejemplos reales.
- No añadir dependencias sin justificar.
- Mantener la generación editable y el aviso legal visible.
- Actualizar `ai/WORKLOG.md`, `ai/TASKS.md`, `ai/SESSION_STATE.md` y `ai/FILE_MAP.md` cuando corresponda.

## Validación mínima

```bash
npm run ci
```
