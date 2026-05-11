# FILE_MAP — Reclama.ai

## Mapa actual

```text
.
├── README.md
├── AGENTS.md                  [pendiente]
├── CLAUDE.md                  [pendiente]
├── .github/
│   └── copilot-instructions.md [pendiente]
└── ai/
    ├── REPO_BRAIN.md
    ├── GUARDRAILS.md
    ├── TASKS.md
    ├── WORKLOG.md             [pendiente]
    ├── FILE_MAP.md
    └── SESSION_STATE.md       [pendiente]
```

## Dónde mirar según el cambio

### Entender el proyecto
1. `AGENTS.md`
2. `ai/REPO_BRAIN.md`
3. `ai/GUARDRAILS.md`
4. `ai/TASKS.md`
5. `ai/SESSION_STATE.md`

### Cambios legales o de tono
- `ai/GUARDRAILS.md`
- Futuro: `docs/legal-disclaimer.md`

### Backlog y prioridades
- `ai/TASKS.md`

### Estado de sesión
- `ai/SESSION_STATE.md`
- `ai/WORKLOG.md`

### README público
- `README.md`

### Instrucciones por herramienta IA
- `AGENTS.md`: entrada general para cualquier IA.
- `CLAUDE.md`: Claude Code.
- `.github/copilot-instructions.md`: GitHub Copilot.

## Estado técnico
No existe todavía estructura de aplicación.

Cuando se cree, actualizar este archivo con:
- Stack elegido.
- Entry points.
- Carpetas de componentes.
- Librerías clave.
- Scripts de ejecución.
- Cómo validar cambios.

## Exclusiones habituales
No analizar ni modificar salvo necesidad explícita:
- `.git/`
- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.venv/`
- archivos de secretos
- datasets o documentos reales de usuarios