# REPO_BRAIN — Reclama.ai

## Propósito

Ayudar a consumidores a preparar reclamaciones formales de forma guiada, privada y clara.

## Estado actual

- Repositorio: `mlarbi84/Reclama.ai`
- Rama principal: `main`
- Producto: MVP funcional
- Stack: HTML, CSS, JavaScript ES modules, Node.js solo para validación/build
- Despliegue: Vercel estático
- Backend: ninguno
- Persistencia: ninguna
- Servicios externos: ninguno

## Usuario

Consumidor particular en España que necesita un primer borrador y no domina lenguaje formal.

## Flujo

Landing → categoría → incidencia → hechos → petición → vista previa → exportación.

## Arquitectura

La aplicación funciona completamente en el navegador. `js/claim.js` genera el texto, `js/pdf.js` construye un PDF local, `js/validation.js` valida y `js/app.js` gestiona la interfaz.

## Decisiones

- Generación determinista antes que LLM externo.
- Sin login ni historial.
- Datos mínimos.
- Código sin dependencias de runtime.
- Vercel para disponibilidad y previews.

## Futuro

La IA real solo se evaluará con consentimiento, minimización, política de privacidad y arquitectura que evite enviar datos sensibles innecesarios.
