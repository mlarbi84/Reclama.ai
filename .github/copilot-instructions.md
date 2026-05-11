# GitHub Copilot instructions — Reclama.ai

## Contexto
Reclama.ai es un proyecto en fase inicial para construir una herramienta que ayude a consumidores a preparar reclamaciones formales.

Antes de sugerir cambios relevantes, consulta:
- `AGENTS.md`
- `ai/REPO_BRAIN.md`
- `ai/GUARDRAILS.md`
- `ai/TASKS.md`
- `ai/FILE_MAP.md`
- `ai/SESSION_STATE.md`

## Principios
- Simplicidad antes que arquitectura compleja.
- Producto usable antes que automatización avanzada.
- Privacidad por defecto.
- Aviso legal visible.
- Reclamaciones firmes, educadas y basadas en hechos.

## Evitar
- Prometer resultados legales.
- Dar asesoramiento jurídico como si fuera profesional.
- Guardar datos personales sin diseño explícito.
- Añadir dependencias pesadas sin motivo.
- Crear ejemplos con datos reales.
- Generar textos agresivos o acusatorios sin pruebas.

## Futuro stack probable
[PENDIENTE DE CONFIRMAR]

Hipótesis recomendada:
- Next.js
- TypeScript
- Vercel
- Supabase más adelante si hay login/historial

## Validación futura
Cuando exista código:
- Debe compilar.
- Debe generar reclamación editable.
- Debe permitir revisar antes de exportar/enviar.
- Debe mostrar disclaimer.
- Debe funcionar con datos ficticios.