# Operación en producción

## Plataforma

Despliegue estático en Vercel desde GitHub.

## Pipeline

1. Pull request ejecuta CI.
2. Vercel crea preview de la rama.
3. Se valida flujo, móvil, descarga y cabeceras.
4. Merge a `main` publica producción.

## Comprobaciones de lanzamiento

- `npm run ci` en verde.
- Página principal, privacidad, aviso legal y 404 accesibles.
- Formulario completo con un caso ficticio.
- PDF y TXT descargables.
- Sin errores en consola.
- Cabeceras CSP, frame, MIME, referrer y permissions presentes.
- No existen claves ni variables de entorno.

## Rollback

Vercel conserva despliegues inmutables. Ante un error, promover el despliegue estable anterior o revertir el commit en GitHub.

## Observabilidad mínima

La aplicación no registra contenido ni eventos de producto. Revisar únicamente estado de despliegue, errores de entrega y disponibilidad. Si se añade analítica, deberá ser una decisión explícita con revisión de privacidad.

## Riesgos pendientes

- Revisión jurídica antes de uso comercial.
- Dominio propio y datos identificativos del titular.
- Pruebas manuales en Safari iOS y Android antes de campaña pública.
