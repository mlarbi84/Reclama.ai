# AGENTS — Reclama.ai

## Antes de trabajar
Toda IA que entre en este repo debe leer, en este orden:

1. `ai/REPO_BRAIN.md`
2. `ai/GUARDRAILS.md`
3. `ai/TASKS.md`
4. `ai/FILE_MAP.md`
5. `ai/SESSION_STATE.md`
6. `ai/WORKLOG.md`

Después debe resumir:
- Qué entiende del proyecto.
- Qué va a modificar.
- Qué riesgo puede tener el cambio.

## Naturaleza del proyecto
Reclama.ai está en fase inicial. El objetivo asumido es crear una herramienta web para ayudar a consumidores a preparar reclamaciones formales.

No hay todavía aplicación funcional ni stack confirmado.

## Guardrail principal
No presentar Reclama.ai como abogado, asesor jurídico ni garantía de éxito. Es una ayuda orientativa para redactar reclamaciones revisables por el usuario.

## Reglas de trabajo
- No tocar `.git/`, secretos ni archivos generados pesados.
- No introducir dependencias sin justificar.
- No crear backend ni persistencia de datos personales sin revisar privacidad.
- No usar datos personales reales en ejemplos.
- No prometer funcionalidades que no existan.
- Marcar inferencias como `[INFERIDO]`.
- Marcar lagunas como `[PENDIENTE DE CONFIRMAR]`.

## Al modificar
- Mantén cambios pequeños y trazables.
- Actualiza `ai/WORKLOG.md`.
- Actualiza `ai/TASKS.md` si cambia el backlog.
- Actualiza `ai/SESSION_STATE.md` con el siguiente paso.
- Si cambia la estructura, actualiza `ai/FILE_MAP.md`.

## Validación mínima futura
Cuando exista app:
- Debe arrancar localmente.
- Debe generar una reclamación editable.
- Debe mostrar aviso legal.
- No debe almacenar datos personales salvo decisión explícita.
- Debe tener casos de prueba ficticios.