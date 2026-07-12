# Reclama.ai

Asistente conversacional privado para convertir un relato cotidiano en una reclamación formal, editable y exportable.

## Estado

MVP funcional desplegable como sitio estático en Vercel. No requiere backend, base de datos, claves ni servicios externos.

## Experiencia de usuario

1. El usuario cuenta qué ha pasado con sus palabras.
2. El navegador detecta categoría, empresa, fechas, importe, referencia, gestiones, pruebas y petición.
3. El asistente hace como máximo tres preguntas, todas saltables.
4. Se genera un borrador aunque falten datos, marcándolos entre corchetes.
5. El usuario corrige los datos detectados, edita el documento y lo exporta.

## Funcionalidades

- Landing responsive y accesible.
- Entrada inicial mediante relato libre, sin selector de categoría.
- Extracción local de información mediante reglas deterministas.
- Preguntas dinámicas únicamente sobre empresa, fecha o solución cuando falten.
- Generación temprana del borrador sin exigir datos personales.
- Panel compacto para corregir los datos detectados.
- Vista previa completamente editable.
- Copia al portapapeles, PDF, TXT e impresión.
- Borrado inmediato del contenido y ausencia de persistencia.
- Páginas de privacidad, aviso legal y error 404.
- Cabeceras de seguridad para Vercel.
- Pruebas automáticas y CI sin dependencias externas.

## Qué significa “asistente inteligente” en esta versión

No se utiliza un LLM externo. El análisis del relato se realiza mediante lógica local y transparente en el navegador. Esto permite validar la experiencia conversacional sin transmitir reclamaciones ni datos personales a terceros. Una futura integración con un modelo deberá ser opcional, consentida y diseñada con retención mínima.

## Ejecutar en local

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

## Validar

```bash
npm run ci
```

El proyecto usa únicamente APIs estándar del navegador y Node.js. `npm ci` no descarga dependencias porque no existen dependencias de producción ni desarrollo.

## Construir

```bash
npm run build
```

Genera el sitio publicable en `dist/`.

## Desplegar en Vercel

El repositorio incluye `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22 o superior

## Arquitectura

```text
index.html                 landing + experiencia conversacional
styles.css                 sistema visual y responsive
js/app.js                  conversación, preguntas y revisión
js/extractor.js            extracción local desde lenguaje natural
js/validation.js           limpieza y validación auxiliar
js/claim.js                generación del documento
js/pdf.js                  generación local del PDF
tests/                     pruebas con node:test
scripts/                   checks y build estático
docs/                      producto, MVP, legal y operación
```

## Privacidad

El relato y la reclamación no se transmiten al servidor. No existe login, historial, analítica ni persistencia. El PDF se construye localmente.

## Alcance legal

Reclama.ai ayuda a redactar un borrador. No sustituye asesoramiento jurídico, no representa al usuario y no garantiza el resultado. Antes de una explotación comercial deben completarse los datos identificativos del titular y realizarse una revisión jurídica.
