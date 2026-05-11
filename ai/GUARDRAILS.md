# GUARDRAILS — Reclama.ai

## Regla principal
Reclama.ai ayuda a preparar reclamaciones. No sustituye a un abogado, asesor jurídico, OMIC, asociación de consumidores ni autoridad competente.

## No prometer
No usar mensajes que impliquen:
- Garantía de éxito.
- Representación legal.
- Asesoramiento jurídico profesional.
- Que una reclamación generada sea suficiente en todos los casos.
- Que el sistema conoce todos los plazos legales actualizados sin verificación.

## Aviso legal obligatorio
Toda pantalla o documento generado debe incluir una variante de:

> Este documento es una ayuda orientativa para preparar una reclamación. Revisa los datos, adjunta pruebas y consulta con un profesional o entidad competente si tu caso tiene impacto económico, legal o personal relevante.

## Datos personales y privacidad
- No pedir más datos de los necesarios.
- Evitar almacenar documentos o datos sensibles en el MVP.
- Si se añade persistencia, definir antes política de privacidad y base legal.
- No registrar datos personales en logs.
- No incluir ejemplos con datos reales.

## Tono de las reclamaciones
Las reclamaciones deben ser:
- Firmes.
- Educadas.
- Basadas en hechos.
- Cronológicas.
- Sin insultos.
- Sin amenazas improcedentes.
- Sin acusaciones no demostrables.

## Validación humana
Antes de exportar o enviar:
- Mostrar vista previa editable.
- Pedir revisión del usuario.
- Mostrar checklist de pruebas adjuntas.

## Fuentes legales
[PENDIENTE DE CONFIRMAR]

Cuando se usen referencias legales:
- Verificar fuente oficial o reconocida.
- Incluir fecha de consulta si se documenta.
- Evitar afirmar plazos o derechos específicos sin fuente.

## Categorías sensibles
Extremar cautela con:
- Reclamaciones sanitarias.
- Menores.
- Deudas, embargos o procedimientos judiciales.
- Fraude bancario.
- Casos laborales.
- Denuncias penales.

En esos casos, orientar a buscar ayuda profesional o autoridad competente.

## Cambios funcionales
No modificar lógica, stack ni arquitectura sin:
1. Revisar `AGENTS.md`.
2. Revisar `ai/REPO_BRAIN.md`.
3. Revisar `ai/TASKS.md`.
4. Actualizar `ai/WORKLOG.md` y `ai/SESSION_STATE.md` al cierre.

## Reglas para futuras IAs
- No inventar estado del repo.
- Marcar inferencias como `[INFERIDO]`.
- Marcar huecos como `[PENDIENTE DE CONFIRMAR]`.
- No introducir dependencias pesadas sin justificar.
- No almacenar secretos.
- No crear ficheros grandes generados dentro del repo sin necesidad.
- Mantener el proyecto simple hasta validar propuesta de valor.