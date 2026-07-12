# Seguridad

## Reporte de vulnerabilidades

No publiques datos personales ni detalles explotables en una incidencia pública. Abre una incidencia con información mínima y solicita un canal privado al mantenedor del repositorio.

## Diseño actual

- Sin backend ni base de datos.
- Sin secretos ni variables de entorno.
- Sin dependencias de runtime.
- CSP y cabeceras defensivas en Vercel.
- Ningún contenido del formulario se envía al servidor.

## Alcance

El proveedor de alojamiento y el navegador quedan fuera del código de la aplicación. Mantén ambos actualizados y revisa la configuración de Vercel antes de cada lanzamiento.
