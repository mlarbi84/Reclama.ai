# WORKLOG — Reclama.ai

## 2026-05-11 — Inicialización

Se creó la memoria operativa, guardrails e instrucciones para agentes.

## 2026-07-12 — MVP de producción

Se implementó la primera aplicación estática: formulario guiado, generación local, edición, exportación, privacidad, seguridad, pruebas y despliegue.

## 2026-07-12 — Onboarding conversacional

### Problema detectado

El formulario exigía al usuario estructurar el caso antes de recibir valor y generaba una barrera de entrada excesiva.

### Decidido

- Empezar con una única explicación libre.
- Extraer automáticamente la información en el navegador.
- Preguntar solo empresa, fecha o solución cuando falten.
- Limitar el diálogo a tres preguntas saltables.
- No pedir identidad antes de mostrar el borrador.
- Mantener el MVP sin LLM externo para preservar privacidad y operación sin claves.

### Implementado

- Conversación visual y relato inicial.
- Extracción local de categoría, empresa, importe, fecha, referencia, gestiones, pruebas y petición.
- Resumen de lo entendido.
- Preguntas dinámicas y saltables.
- Borradores con marcadores para datos pendientes.
- Panel de corrección y actualización del documento.
- Nuevas pruebas del extractor y del flujo incompleto.

### Riesgos pendientes

- La extracción determinista no comprenderá todos los relatos.
- Se necesita validación con lenguaje real y casos ambiguos.
- Cualquier LLM futuro exigirá revisión específica de privacidad, consentimiento y logs.
