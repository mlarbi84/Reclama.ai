# Alcance del MVP

## Incluido

- Seis categorías generales.
- Formulario en cinco pasos.
- Datos mínimos: empresa, motivo, fecha, hechos, petición e identidad del firmante.
- Campos opcionales para referencia, importe, gestiones, pruebas, correo, localidad y plazo solicitado.
- Generación local mediante plantilla determinista.
- Edición, copia, PDF, TXT e impresión.
- Privacidad y aviso legal.
- Responsive, accesibilidad básica, validación y CI.

## Decisiones técnicas

Se usa HTML, CSS y JavaScript modular sin framework ni backend. La ausencia de dependencias reduce riesgo de cadena de suministro, peso, costes y mantenimiento. La arquitectura permite migrar a un framework cuando el producto necesite cuentas, pagos o servidor.

## Criterios de aceptación

1. El flujo completo funciona en móvil y escritorio.
2. No se envía el contenido a la red.
3. Los datos obligatorios aparecen en el borrador.
4. El usuario puede editar antes de exportar.
5. El PDF contiene texto legible con caracteres españoles habituales.
6. El aviso legal es visible.
7. `npm run ci` finaliza correctamente.
8. Vercel sirve el contenido con cabeceras de seguridad.
