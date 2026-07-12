# Reclama.ai

Aplicación web privada y guiada para ayudar a consumidores a preparar reclamaciones formales claras, editables y exportables.

## Estado

MVP funcional listo para despliegue estático en Vercel. No requiere backend, base de datos, claves ni servicios externos.

## Funcionalidades

- Landing responsive y accesible.
- Formulario guiado en cinco pasos.
- Categorías de telecomunicaciones, compras, viajes, banca/seguros, suministros y otros.
- Validación de fechas, importes y campos mínimos.
- Generación determinista del borrador en el navegador.
- Vista previa completamente editable.
- Copia al portapapeles.
- Descarga directa en PDF y TXT.
- Impresión / guardado mediante el diálogo del navegador.
- Borrado inmediato del contenido y ausencia de persistencia.
- Páginas de privacidad, aviso legal y error 404.
- Cabeceras de seguridad para Vercel.
- Pruebas automáticas y CI sin dependencias externas.

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

El repositorio incluye `vercel.json`. Al importarlo en Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22 o superior

Cada PR puede generar una preview y la rama `main` debe quedar asociada a producción.

## Arquitectura

```text
index.html                 landing + flujo completo
styles.css                 sistema visual y responsive
js/app.js                  interacción y estado en memoria
js/validation.js           validación y limpieza
js/claim.js                generación del documento
js/pdf.js                  generación local del PDF
tests/                     pruebas con node:test
scripts/                   checks y build estático
docs/                      producto, MVP, legal y operación
```

## Privacidad

El contenido de la reclamación no se transmite al servidor. No existe login, historial, analítica ni persistencia. El PDF se construye localmente.

## Alcance legal

Reclama.ai ayuda a redactar un borrador. No sustituye asesoramiento jurídico, no representa al usuario y no garantiza el resultado. Antes de una explotación comercial deben completarse los datos identificativos del titular y realizarse una revisión jurídica.
