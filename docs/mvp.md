# Alcance del MVP

## Incluido

- Relato libre como única entrada inicial.
- Detección automática de seis categorías generales.
- Extracción local de empresa, fecha, importe, referencia, hechos, gestiones, pruebas y petición.
- Máximo tres preguntas de aclaración, todas saltables.
- Generación de borrador con marcadores si faltan datos.
- Identidad y contacto opcionales hasta la revisión.
- Edición, copia, PDF, TXT e impresión.
- Privacidad, aviso legal, responsive, accesibilidad básica y CI.

## Decisiones técnicas

Se usa HTML, CSS y JavaScript modular sin framework ni backend. La extracción conversacional es determinista y se ejecuta en el navegador. Esta decisión evita transmitir datos personales, elimina la necesidad de claves y permite validar primero si el cambio de interacción reduce la barrera de entrada.

## Criterios de aceptación

1. Un relato suficientemente completo genera el borrador sin preguntas.
2. Un relato incompleto provoca como máximo tres preguntas.
3. Todas las preguntas se pueden saltar.
4. El borrador se genera aunque falten datos y los marca claramente.
5. El usuario puede corregir los datos detectados y editar el texto.
6. No se envía el contenido a la red.
7. PDF y TXT se generan localmente.
8. `npm run ci` finaliza correctamente.
9. Vercel sirve el contenido con cabeceras de seguridad.
