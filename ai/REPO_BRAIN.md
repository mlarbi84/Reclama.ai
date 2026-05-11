# REPO_BRAIN — Reclama.ai

## Propósito
Reclama.ai es un producto B2C orientado a ayudar a consumidores a preparar reclamaciones formales de forma guiada y clara.

El objetivo inicial no es sustituir asesoramiento jurídico, sino transformar un problema cotidiano en un documento reclamable, ordenado, educado y listo para revisar antes de enviar.

## Estado actual
- Repositorio: `mlarbi84/Reclama.ai`
- Rama principal: `main`
- Visibilidad: público
- Estado: fase cero / arranque de producto
- Código funcional: no existe todavía
- Documentación previa: README mínimo con el título del proyecto

## Tipo de proyecto
- Producto digital
- MVP web
- Asistente documental con IA
- [INFERIDO] SaaS ligero o herramienta freemium futura

## Usuario principal
[PENDIENTE DE CONFIRMAR]

Hipótesis operativa inicial:
- Consumidor particular que quiere reclamar a una empresa o entidad.
- Usuario no experto en lenguaje jurídico.
- Necesita una guía paso a paso, no un sistema complejo.

## Casos de uso iniciales
[PENDIENTE DE CONFIRMAR]

Hipótesis para MVP:
1. Telecomunicaciones: facturas, permanencias, baja no aplicada.
2. Compras online / comercios: devolución, producto defectuoso, garantía.
3. Aerolíneas / viajes: retrasos, cancelaciones, equipaje.
4. Bancos / seguros: comisiones, cargos, incidencias contractuales.

Para no dispersar el MVP, empezar con un flujo genérico y plantillas por categoría.

## Propuesta de MVP
Primera versión mínima:
1. Landing clara.
2. Selector de tipo de reclamación.
3. Formulario guiado de hechos.
4. Generación de texto formal de reclamación.
5. Edición manual del texto.
6. Copiar al portapapeles.
7. Exportar a PDF.
8. Aviso legal visible.

Fuera del MVP inicial:
- Envío automático a empresas.
- Burofax.
- Representación jurídica.
- Predicción de éxito legal.
- Almacenamiento de documentación sensible.
- Login complejo.
- Pagos.

## Stack recomendado
[PENDIENTE DE CONFIRMAR]

Recomendación inicial:
- Next.js + TypeScript para producto web serio.
- Vercel para despliegue rápido.
- Sin backend al principio si se puede resolver localmente.
- Posteriormente Supabase para usuarios, historial y almacenamiento.

Alternativa ultrarrápida:
- HTML/CSS/JS puro si solo se quiere validar UX y propuesta de valor.

## Arquitectura inicial sugerida
```text
app/
  page.tsx
  reclamar/
    page.tsx
  resultado/
    page.tsx
components/
  ClaimForm.tsx
  ClaimPreview.tsx
  Disclaimer.tsx
lib/
  claimTemplates.ts
  generateClaim.ts
  pdf.ts
docs/
  product.md
  legal-disclaimer.md
```

## Datos sensibles
Reclama.ai puede tratar datos sensibles o personales:
- Nombre completo
- DNI/NIE
- Dirección
- Teléfono/email
- Contratos
- Facturas
- IBAN parcial
- Datos de salud, viajes o menores según caso

Regla inicial: minimizar datos. No almacenar nada salvo decisión explícita.

## Tono del producto
- Claro
- Firme
- Formal
- No agresivo
- Sin promesas legales
- Orientado a hechos y derechos básicos del consumidor

## Decisiones tomadas
- Crear primero memoria operativa para IA.
- Tratar lagunas como `[PENDIENTE DE CONFIRMAR]`.
- No realizar cambios funcionales todavía.
- Priorizar contexto, guardrails y backlog antes de código.

## Lagunas vivas
- Usuario objetivo definitivo.
- Categorías iniciales.
- Stack final.
- Modelo de negocio.
- Fuentes legales de referencia.
- Política de privacidad.
- Nivel real de IA: plantillas, LLM externo, generación local o híbrida.