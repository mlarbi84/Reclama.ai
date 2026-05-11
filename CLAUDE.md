# CLAUDE — Reclama.ai

## Instrucciones para Claude Code

Antes de escribir código o documentación, lee:

```text
AGENTS.md
ai/REPO_BRAIN.md
ai/GUARDRAILS.md
ai/TASKS.md
ai/FILE_MAP.md
ai/SESSION_STATE.md
```

## Objetivo actual
Preparar Reclama.ai como producto MVP. Aún no hay stack confirmado ni código funcional.

## Prioridad de trabajo
1. Consolidar documentación de producto.
2. Definir MVP.
3. Definir disclaimer legal.
4. Solo después, crear estructura técnica.

## Estilo de cambios
- Cambios pequeños.
- Sin sobreingeniería.
- Sin dependencias innecesarias.
- Documentar decisiones.
- No crear arquitectura compleja antes de validar flujo.

## Producto
Reclama.ai debe ayudar a generar reclamaciones formales, claras y revisables.

Nunca debe presentarse como:
- abogado
- asesoría jurídica
- garantía de éxito
- sustituto de entidades oficiales o profesionales

## Privacidad
No almacenar datos personales sin decisión explícita.
No enviar datos a servicios externos sin consentimiento claro.
No usar datos reales en ejemplos.

## Cierre de sesión
Antes de terminar:
- Actualiza `ai/WORKLOG.md`.
- Actualiza `ai/TASKS.md`.
- Actualiza `ai/SESSION_STATE.md`.
- Indica qué queda pendiente.